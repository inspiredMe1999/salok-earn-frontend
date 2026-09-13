import {
    ArrowUpRight,
    ChevronsRight,
    Home,
    Image as ImageIcon,
    Lock,
    MessageCircle,
    Paperclip,
    Reply,
    Send,
    Smile,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import communityService from "../../services/mock/communityService";
import useAuth from "../../hooks/useAuth";

import "./FloatingChat.css";

const CURRENT_USER_ID = "mock-user-001";

const QUICK_REACTIONS = [
    "👍",
    "❤️",
    "🔥",
    "😂",
    "👏",
    "💯",
];

// How far from the left edge the drag handle rests.
const HANDLE_LEFT = 22;

// Minimum horizontal drag (px) to count as an "open" gesture.
const OPEN_DRAG_THRESHOLD = 70;

// Minimum horizontal drag (px) to count as a "close" gesture.
const CLOSE_DRAG_THRESHOLD = 70;

// How far the handle / home icon travels — following the pointer
// 1:1 — before it's fully faded out. Also the distance over which
// its companion icon fades in as a "coming alive" preview.
const DRAG_TRAVEL = 120;

// Below this many px of movement, a gesture hasn't committed to an
// axis yet (see the "mode" lock in handlePointerMove).
const AXIS_LOCK_THRESHOLD = 6;

function formatTime(timestamp) {
    if (!timestamp) return "";

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(timestamp));
}

function Avatar({ initials }) {
    return (
        <div className="floating-chat-avatar">
            {initials}
        </div>
    );
}

function FloatingMessage({
    message,
    onReply,
    onReaction,
}) {
    const isOwn =
        message.userId === CURRENT_USER_ID;

    return (
        <div
            className={`floating-message ${isOwn
                ? "floating-message-own"
                : ""
                }`}
        >
            {!isOwn && (
                <Avatar
                    initials={message.initials}
                />
            )}

            <div className="floating-message-body">
                {!isOwn && (
                    <div className="floating-message-author">
                        {message.displayName}
                    </div>
                )}

                <div
                    className={`floating-message-bubble ${isOwn
                        ? "floating-message-bubble-own"
                        : ""
                        }`}
                >
                    {message.replyTo && (
                        <div className="floating-message-reply">
                            <Reply size={12} />

                            <div>
                                <strong>
                                    {
                                        message
                                            .replyTo
                                            .displayName
                                    }
                                    :
                                </strong>

                                <span>
                                    {
                                        message
                                            .replyTo
                                            .message
                                    }
                                </span>
                            </div>
                        </div>
                    )}

                    {message.imageUrl && (
                        <div className="floating-message-image">
                            <img
                                src={
                                    message.imageUrl
                                }
                                alt="Shared"
                            />
                        </div>
                    )}

                    {message.message && (
                        <p>
                            {message.message}
                        </p>
                    )}

                    <span className="floating-message-time">
                        {formatTime(
                            message.timestamp
                        )}
                    </span>
                </div>

                <div className="floating-message-actions">
                    <button
                        type="button"
                        onClick={() =>
                            onReply(message)
                        }
                    >
                        <Reply size={12} />
                    </button>

                    {QUICK_REACTIONS
                        .slice(0, 3)
                        .map((emoji) => (
                            <button
                                key={emoji}
                                type="button"
                                onClick={() =>
                                    onReaction(
                                        message.id,
                                        emoji
                                    )
                                }
                            >
                                {emoji}
                            </button>
                        ))}
                </div>
            </div>

            {isOwn && (
                <Avatar
                    initials={
                        message.initials
                    }
                />
            )}
        </div>
    );
}

function FloatingChat() {
    const location = useLocation();
    const navigate = useNavigate();

    const { isAuthenticated } = useAuth();

    const launcherRef = useRef(null);
    const fileInputRef = useRef(null);

    const dragData = useRef({
        dragging: false,
        moved: false,
        // "vertical" | "horizontal" | null — locked in once the
        // gesture crosses AXIS_LOCK_THRESHOLD on one axis, and never
        // re-evaluated for the rest of that drag.
        mode: null,
        startX: 0,
        startY: 0,
        startCenterY: 0,
    });

    const homeDragData = useRef({
        dragging: false,
        moved: false,
        startX: 0,
    });

    const [isOpen, setIsOpen] =
        useState(false);

    // Vertical center (px) of the drag handle. Horizontal position is
    // always fixed at HANDLE_LEFT — only up/down dragging is allowed.
    const [centerY, setCenterY] = useState(() => {
        if (typeof window === "undefined") {
            return 320;
        }

        return window.innerHeight / 2;
    });

    // Transient rubber-band offset while a drag is in progress. Always
    // snaps back to 0 on release — it never becomes the resting position.
    const [dragOffsetX, setDragOffsetX] = useState(0);
    const [homeDragOffsetX, setHomeDragOffsetX] = useState(0);

    const [messages, setMessages] =
        useState([]);

    const [messageText, setMessageText] =
        useState("");

    const [replyingTo, setReplyingTo] =
        useState(null);

    const [attachedImage, setAttachedImage] =
        useState(null);

    const [imagePreview, setImagePreview] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [sending, setSending] =
        useState(false);

    const [uploading, setUploading] =
        useState(false);

    const [showEmojiPicker, setShowEmojiPicker] =
        useState(false);

    const [dragging, setDragging] =
        useState(false);

    const [homeDragging, setHomeDragging] =
        useState(false);

    useEffect(() => {
        loadMessages();
    }, []);

    // Keep the handle within the viewport if the window is resized.
    useEffect(() => {
        function handleResize() {
            const height =
                launcherRef.current?.offsetHeight || 58;

            const margin = 12;

            setCenterY((current) =>
                Math.max(
                    margin + height / 2,
                    Math.min(
                        current,
                        window.innerHeight -
                        margin -
                        height / 2
                    )
                )
            );
        }

        window.addEventListener(
            "resize",
            handleResize
        );

        return () =>
            window.removeEventListener(
                "resize",
                handleResize
            );
    }, []);

    /*
    |--------------------------------------------------------------------------
    | The community page has its own full chat experience, so the floating
    | bubble would be redundant (and would float on top of it) there.
    |--------------------------------------------------------------------------
    */

    if (location.pathname.startsWith("/community")) {
        return null;
    }

    function promptSignIn(message) {
        toast.info(
            message ||
            "Create a free account to join the conversation."
        );

        navigate("/signup", {
            state: {
                from: location.pathname,
            },
        });
    }

    async function loadMessages() {
        try {
            setLoading(true);

            const response =
                await communityService.getCommunityMessages();

            if (!response?.success) {
                return;
            }

            // Keep the floating window compact.
            setMessages(
                (response.data || []).slice(-8)
            );
        } catch (error) {
            console.error(
                "Floating chat load failed:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Dragging — handle (vertical reposition + drag-right-to-open)
    |--------------------------------------------------------------------------
    */

    function handlePointerDown(event) {
        if (event.button !== 0) return;
        if (isOpen) return;

        const launcher =
            launcherRef.current;

        if (!launcher) return;

        dragData.current = {
            dragging: true,
            moved: false,
            mode: null,
            startX: event.clientX,
            startY: event.clientY,
            startCenterY: centerY,
        };

        setDragging(true);

        launcher.setPointerCapture?.(
            event.pointerId
        );
    }

    function handlePointerMove(event) {
        const data =
            dragData.current;

        if (!data.dragging) return;

        const deltaX =
            event.clientX -
            data.startX;

        const deltaY =
            event.clientY -
            data.startY;

        /*
        |--------------------------------------------------------------------------
        | Axis lock — decided once, on the first meaningful movement,
        | then held for the rest of the gesture. This is what keeps a
        | horizontal drag from also nudging the handle up/down (and
        | vice versa) if the pointer wanders slightly off-axis mid-drag.
        |--------------------------------------------------------------------------
        */

        if (!data.mode) {
            if (
                Math.abs(deltaX) > AXIS_LOCK_THRESHOLD ||
                Math.abs(deltaY) > AXIS_LOCK_THRESHOLD
            ) {
                data.mode =
                    Math.abs(deltaX) > Math.abs(deltaY)
                        ? "horizontal"
                        : "vertical";

                data.moved = true;
            } else {
                return;
            }
        }

        if (data.mode === "vertical") {
            // Vertical reposition only — horizontal offset stays
            // locked at 0 for the rest of this drag.
            const launcher =
                launcherRef.current;

            const height =
                launcher?.offsetHeight || 58;

            const viewportHeight =
                window.innerHeight;

            const margin = 12;

            let newCenterY =
                data.startCenterY + deltaY;

            newCenterY = Math.max(
                margin + height / 2,
                Math.min(
                    newCenterY,
                    viewportHeight -
                    margin -
                    height / 2
                )
            );

            setCenterY(newCenterY);
            return;
        }

        // Horizontal drag recognized — the button now travels with
        // the pointer (1:1, clamped), and vertical stays fully
        // locked out no matter how the pointer moves from here on.
        const travel = Math.max(
            0,
            Math.min(deltaX, DRAG_TRAVEL)
        );

        setDragOffsetX(travel);
    }

    function handlePointerUp(event) {
        const data =
            dragData.current;

        if (!data.dragging) return;

        data.dragging = false;

        setDragging(false);
        setDragOffsetX(0);

        /*
        |--------------------------------------------------------------------------
        | Plain click → open
        |--------------------------------------------------------------------------
        */

        if (!data.moved) {
            openChat();
            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Horizontal drag past the threshold → open
        |--------------------------------------------------------------------------
        |
        | Vertical drags just reposition the handle (already applied live
        | during the move above) and never open the chat.
        |
        */

        if (data.mode === "horizontal") {
            const deltaX =
                event.clientX -
                data.startX;

            if (deltaX > OPEN_DRAG_THRESHOLD) {
                openChat();
            }
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Dragging — home icon (drag-left-to-close)
    |--------------------------------------------------------------------------
    */

    function handleHomePointerDown(event) {
        if (event.button !== 0) return;

        homeDragData.current = {
            dragging: true,
            moved: false,
            startX: event.clientX,
        };

        setHomeDragging(true);

        event.currentTarget.setPointerCapture?.(
            event.pointerId
        );
    }

    function handleHomePointerMove(event) {
        const data = homeDragData.current;

        if (!data.dragging) return;

        const deltaX =
            event.clientX - data.startX;

        if (Math.abs(deltaX) > 5) {
            data.moved = true;
        }

        // The icon now travels with the pointer (1:1, clamped) —
        // only ever leftward, since it rests at the right edge.
        const travel = Math.min(
            0,
            Math.max(deltaX, -DRAG_TRAVEL)
        );

        setHomeDragOffsetX(travel);
    }

    function handleHomePointerUp(event) {
        const data = homeDragData.current;

        if (!data.dragging) return;

        data.dragging = false;

        setHomeDragging(false);
        setHomeDragOffsetX(0);

        const deltaX =
            event.clientX - data.startX;

        if (!data.moved) {
            closeChat();
            return;
        }

        if (deltaX < -CLOSE_DRAG_THRESHOLD) {
            closeChat();
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Open / Close
    |--------------------------------------------------------------------------
    */

    function openChat() {
        setIsOpen(true);

        setTimeout(() => {
            document
                .querySelector(
                    ".floating-chat-input"
                )
                ?.focus();
        }, 350);
    }

    function closeChat() {
        setIsOpen(false);
        setShowEmojiPicker(false);
    }

    /*
    |--------------------------------------------------------------------------
    | Image
    |--------------------------------------------------------------------------
    */

    function selectImage() {
        fileInputRef.current?.click();
    }

    async function handleImageSelected(
        event
    ) {
        const file =
            event.target.files?.[0];

        if (!file) return;

        setUploading(true);

        try {
            const response =
                await communityService.uploadCommunityImage(
                    file
                );

            if (!response?.success) {
                toast.error(
                    response?.message ||
                    "Unable to attach image."
                );

                return;
            }

            setAttachedImage({
                file,
                ...response.data,
            });

            setImagePreview(
                response.data.url
            );
        } catch (error) {
            console.error(
                "Floating image upload failed:",
                error
            );

            toast.error(
                "Unable to attach image."
            );
        } finally {
            setUploading(false);

            event.target.value = "";
        }
    }

    function removeImage() {
        if (imagePreview) {
            communityService.revokeCommunityImageUrl(
                imagePreview
            );
        }

        setAttachedImage(null);
        setImagePreview("");
    }

    /*
    |--------------------------------------------------------------------------
    | Reply
    |--------------------------------------------------------------------------
    */

    function handleReply(message) {
        if (!isAuthenticated) {
            promptSignIn(
                "Sign up to reply to messages."
            );

            return;
        }

        setReplyingTo(message);

        setTimeout(() => {
            document
                .querySelector(
                    ".floating-chat-input"
                )
                ?.focus();
        }, 50);
    }

    function cancelReply() {
        setReplyingTo(null);
    }

    /*
    |--------------------------------------------------------------------------
    | Send
    |--------------------------------------------------------------------------
    */

    async function sendMessage() {
        if (!isAuthenticated) {
            promptSignIn(
                "Sign up to send a message."
            );

            return;
        }

        const text =
            messageText.trim();

        if (
            !text &&
            !attachedImage
        ) {
            toast.error(
                "Write a message or attach an image."
            );

            return;
        }

        setSending(true);

        try {
            const replyTo =
                replyingTo
                    ? {
                        id: replyingTo.id,
                        displayName:
                            replyingTo.displayName,
                        message:
                            replyingTo.message ||
                            "Image",
                    }
                    : null;

            const response =
                await communityService.sendCommunityMessage(
                    text,
                    {
                        imageUrl:
                            imagePreview ||
                            null,
                        replyTo,
                    }
                );

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to send message."
                );
            }

            setMessages((current) => [
                ...current.slice(-7),
                response.data,
            ]);

            setMessageText("");
            setReplyingTo(null);
            removeImage();
            setShowEmojiPicker(false);
        } catch (error) {
            console.error(
                "Floating message failed:",
                error
            );

            toast.error(
                error?.message ||
                "Unable to send message."
            );
        } finally {
            setSending(false);
        }
    }

    function handleKeyDown(event) {
        if (
            event.key === "Enter" &&
            !event.shiftKey
        ) {
            event.preventDefault();

            if (!sending) {
                sendMessage();
            }
        }
    }

    function insertEmoji(emoji) {
        setMessageText(
            (current) =>
                `${current}${emoji}`
        );

        setShowEmojiPicker(false);

        document
            .querySelector(
                ".floating-chat-input"
            )
            ?.focus();
    }

    /*
    |--------------------------------------------------------------------------
    | Reaction
    |--------------------------------------------------------------------------
    */

    async function handleReaction(
        messageId,
        emoji
    ) {
        if (!isAuthenticated) {
            promptSignIn(
                "Sign up to react to messages."
            );

            return;
        }

        try {
            const response =
                await communityService.toggleMessageReaction(
                    messageId,
                    emoji
                );

            if (!response?.success) {
                return;
            }

            setMessages((current) =>
                current.map((message) =>
                    message.id === messageId
                        ? response.data
                        : message
                )
            );
        } catch (error) {
            console.error(
                "Floating reaction failed:",
                error
            );
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Drag progress → crossfade
    |--------------------------------------------------------------------------
    |
    | Each button's own drag distance (0–DRAG_TRAVEL) is expressed as a
    | 0–1 progress value. That value drives two things at once: the
    | dragged button fading itself out as it travels, and its
    | companion button quietly "coming alive" — fading and scaling in,
    | in place — as a live preview of what letting go will do.
    |
    */

    const launcherDragProgress =
        Math.min(1, dragOffsetX / DRAG_TRAVEL);

    const homeDragProgress =
        Math.min(1, -homeDragOffsetX / DRAG_TRAVEL);

    const launcherStyle = {
        left: `${HANDLE_LEFT}px`,
        top: `${centerY}px`,
    };

    if (isOpen) {
        // Resting hidden, unless the home icon is mid-drag toward
        // it — in which case the launcher previews coming back to
        // life in place (it doesn't travel; only the dragged icon
        // travels).
        if (homeDragging && homeDragProgress > 0) {
            launcherStyle.transform =
                `translateY(-50%) scale(${(0.7 + 0.3 * homeDragProgress).toFixed(3)})`;

            launcherStyle.opacity = homeDragProgress;
            launcherStyle.pointerEvents = "none";
        }
    } else {
        // Visible, and — while being dragged — following the
        // pointer horizontally.
        launcherStyle.transform =
            `translateY(-50%) translateX(${dragOffsetX}px)`;

        if (dragging && dragOffsetX > 0) {
            launcherStyle.opacity =
                Math.max(0, 1 - launcherDragProgress);
        }
    }

    const homeStyle = {};

    if (!isOpen) {
        // Resting hidden, unless the launcher is mid-drag toward
        // it — same preview treatment, mirrored.
        if (dragging && launcherDragProgress > 0) {
            homeStyle.transform =
                `translateY(-50%) scale(${(0.7 + 0.3 * launcherDragProgress).toFixed(3)})`;

            homeStyle.opacity = launcherDragProgress;
            homeStyle.pointerEvents = "none";
        }
    } else {
        homeStyle.transform =
            `translateY(-50%) translateX(${homeDragOffsetX}px)`;

        if (homeDragging && homeDragOffsetX < 0) {
            homeStyle.opacity =
                Math.max(0, 1 - homeDragProgress);
        }
    }

    return (
        <>
            {/* -------------------------------------------------
                DRAG HANDLE (vertical drag only · click / drag-right to open)
            ------------------------------------------------- */}

            <button
                ref={launcherRef}
                type="button"
                className={`floating-chat-launcher ${dragging
                    ? "floating-chat-launcher-dragging"
                    : ""
                    } ${isOpen
                        ? "floating-chat-launcher-hidden"
                        : ""
                    }`}
                style={launcherStyle}
                onPointerDown={
                    handlePointerDown
                }
                onPointerMove={
                    handlePointerMove
                }
                onPointerUp={
                    handlePointerUp
                }
                tabIndex={isOpen ? -1 : 0}
                aria-hidden={isOpen}
                aria-label="Open community chat"
                title="Drag up or down to move · drag right or tap to open"
            >
                <MessageCircle
                    size={23}
                />

                <span className="floating-chat-online-dot" />

                <ChevronsRight
                    size={13}
                    className="floating-chat-drag-hint"
                    aria-hidden="true"
                />
            </button>

            {/* -------------------------------------------------
                HOME ICON (appears while chat is open · click / drag-left to close)
            ------------------------------------------------- */}

            <button
                type="button"
                className={`floating-home-button ${isOpen
                    ? "floating-home-button-visible"
                    : ""
                    } ${homeDragging
                        ? "floating-home-button-dragging"
                        : ""
                    }`}
                style={homeStyle}
                onPointerDown={
                    handleHomePointerDown
                }
                onPointerMove={
                    handleHomePointerMove
                }
                onPointerUp={
                    handleHomePointerUp
                }
                tabIndex={isOpen ? 0 : -1}
                aria-hidden={!isOpen}
                aria-label="Close community chat"
                title="Drag left or tap to close"
            >
                <Home size={21} />
            </button>

            {/* -------------------------------------------------
                FULL-PAGE COMMUNITY CHAT OVERLAY
            ------------------------------------------------- */}

            <div
                className={`floating-chat-overlay ${isOpen
                    ? "floating-chat-overlay-open"
                    : ""
                    }`}
                aria-hidden={!isOpen}
            >
                <div className="floating-chat-overlay-inner">
                    <div className="floating-chat-panel-header">
                        <div className="floating-chat-heading">
                            <div className="floating-chat-heading-icon">
                                <MessageCircle
                                    size={17}
                                />
                            </div>

                            <div>
                                <strong>
                                    Community Chat
                                </strong>

                                <span>
                                    Join the
                                    conversation
                                </span>
                            </div>
                        </div>

                        <div className="floating-chat-header-actions">
                            <Link
                                to="/community"
                                title="Open full community"
                            >
                                <ArrowUpRight
                                    size={16}
                                />
                            </Link>

                            <button
                                type="button"
                                onClick={
                                    closeChat
                                }
                                title="Close chat"
                            >
                                <X
                                    size={17}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="floating-chat-messages">
                        {loading ? (
                            <div className="floating-chat-loading">
                                <span />
                                Loading chat...
                            </div>
                        ) : messages.length ===
                            0 ? (
                            <div className="floating-chat-empty">
                                <MessageCircle
                                    size={27}
                                />

                                <strong>
                                    Start the
                                    conversation
                                </strong>

                                <span>
                                    Say hello to
                                    the community.
                                </span>
                            </div>
                        ) : (
                            messages.map(
                                (
                                    message
                                ) => (
                                    <FloatingMessage
                                        key={
                                            message.id
                                        }
                                        message={
                                            message
                                        }
                                        onReply={
                                            handleReply
                                        }
                                        onReaction={
                                            handleReaction
                                        }
                                    />
                                )
                            )
                        )}
                    </div>

                    <div className="floating-chat-composer-area">
                        {isAuthenticated ? (
                            <>
                                {replyingTo && (
                                    <div className="floating-chat-reply-preview">
                                        <Reply size={13} />

                                        <div>
                                            <strong>
                                                Replying to{" "}
                                                {
                                                    replyingTo.displayName
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    replyingTo.message
                                                }
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={
                                                cancelReply
                                            }
                                        >
                                            <X
                                                size={
                                                    14
                                                }
                                            />
                                        </button>
                                    </div>
                                )}

                                {attachedImage && (
                                    <div className="floating-chat-image-preview">
                                        <img
                                            src={
                                                imagePreview
                                            }
                                            alt="Attachment"
                                        />

                                        <button
                                            type="button"
                                            onClick={
                                                removeImage
                                            }
                                        >
                                            <X
                                                size={
                                                    13
                                                }
                                            />
                                        </button>
                                    </div>
                                )}

                                {showEmojiPicker && (
                                    <div className="floating-chat-emoji-picker">
                                        {QUICK_REACTIONS.map(
                                            (emoji) => (
                                                <button
                                                    key={
                                                        emoji
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        insertEmoji(
                                                            emoji
                                                        )
                                                    }
                                                >
                                                    {
                                                        emoji
                                                    }
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}

                                <input
                                    ref={
                                        fileInputRef
                                    }
                                    type="file"
                                    accept="image/*"
                                    className="floating-chat-hidden-file"
                                    onChange={
                                        handleImageSelected
                                    }
                                />

                                <div className="floating-chat-composer">
                                    <button
                                        type="button"
                                        onClick={
                                            selectImage
                                        }
                                        disabled={
                                            uploading ||
                                            sending
                                        }
                                        title="Attach image"
                                    >
                                        {uploading ? (
                                            <span className="floating-chat-spinner" />
                                        ) : (
                                            <Paperclip
                                                size={
                                                    16
                                                }
                                            />
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowEmojiPicker(
                                                (
                                                    current
                                                ) =>
                                                    !current
                                            )
                                        }
                                        title="Emoji"
                                    >
                                        <Smile
                                            size={16}
                                        />
                                    </button>

                                    <input
                                        className="floating-chat-input"
                                        value={
                                            messageText
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            setMessageText(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                        onKeyDown={
                                            handleKeyDown
                                        }
                                        placeholder={
                                            replyingTo
                                                ? "Reply..."
                                                : "Message..."
                                        }
                                        maxLength={1000}
                                        disabled={
                                            sending
                                        }
                                    />

                                    <button
                                        type="button"
                                        className="floating-chat-send"
                                        onClick={
                                            sendMessage
                                        }
                                        disabled={
                                            sending ||
                                            uploading ||
                                            (!messageText.trim() &&
                                                !attachedImage)
                                        }
                                    >
                                        {sending ? (
                                            <span className="floating-chat-spinner" />
                                        ) : (
                                            <Send
                                                size={
                                                    16
                                                }
                                            />
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="floating-chat-guest-composer">
                                <div className="floating-chat-guest-icon">
                                    <Lock size={15} />
                                </div>

                                <div className="floating-chat-guest-text">
                                    <strong>
                                        Sign in to join the chat
                                    </strong>

                                    <span>
                                        You can read messages as a guest.
                                    </span>
                                </div>

                                <div className="floating-chat-guest-actions">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate("/login", {
                                                state: {
                                                    from: location.pathname,
                                                },
                                            })
                                        }
                                    >
                                        Log in
                                    </button>

                                    <button
                                        type="button"
                                        className="floating-chat-guest-primary"
                                        onClick={() =>
                                            navigate("/signup", {
                                                state: {
                                                    from: location.pathname,
                                                },
                                            })
                                        }
                                    >
                                        Sign up
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="floating-chat-footer">
                        <ImageIcon
                            size={11}
                        />
                        <span>
                            Images up to 5 MB
                        </span>

                        <span className="floating-chat-footer-dot">
                            •
                        </span>

                        <Link to="/community">
                            Full community
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

export default FloatingChat;