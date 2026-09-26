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

// Diameter (px) of a single icon slot.
const ICON_SIZE = 44;

// Gap (px) between the two icons inside the pill, and also the
// margin left between the visible icon and the true page edge at
// rest — using the same number for both keeps the spacing rhythm
// consistent, and (not coincidentally) is what makes the hidden
// icon land at exactly 0px visible, not peeking or over-hidden.
const ICON_GAP = 6;

// Breathing room (px) between the icons and the pill's own edge —
// on all four sides. Without this the icon exactly fills the pill
// and looks fused to it; this is what gives it a visible ring.
const PILL_PADDING = 5;

// The pill's total width/height — both icons, side by side, the gap
// between them, and padding on every side. This NEVER changes. The
// pill doesn't resize or clip its own content; it's a fixed-size
// object that gets positioned mostly off the page, and the browser's
// own viewport edge is what hides whichever icon is off-screen.
const PILL_WIDTH = ICON_SIZE * 2 + ICON_GAP + PILL_PADDING * 2;
const PILL_HEIGHT = ICON_SIZE + PILL_PADDING * 2;

// The pill's resting "left" (px) when closed: far enough negative
// that the home icon (the first, left-hand icon in the pill) sits
// completely past the page's left edge — 0px of it visible — while
// the chat icon (second, right-hand) ends up sitting ICON_GAP in
// from the true edge. The padding has to be backed out here too,
// since it's the icon's position that must line up with the page
// edge, not the pill's own (padded) outer edge.
const PILL_REST_LEFT_CLOSED = -(ICON_SIZE + PILL_PADDING);

// Fallback travel distance (px), only used before a real measurement
// is available (e.g. before mount). Recomputed on mount, on resize,
// and fresh at the start of every drag.
const DRAG_TRAVEL_FALLBACK = 260;

// Minimum horizontal drag (px) to count as a real gesture, not a tap.
const OPEN_DRAG_THRESHOLD = 70;

// Fraction of the full drag that must be completed for a released
// drag to commit to opening/closing — i.e. it has to actually reach
// (close to) the far side, not just start moving that way.
const DRAG_COMMIT_PROGRESS = 0.9;

// Below this many px of movement, a gesture hasn't committed to an
// axis yet (see the "mode" lock in handlePointerMove).
const AXIS_LOCK_THRESHOLD = 6;

// The pill's resting "left" (px) when open: mirrors the closed
// position — the chat icon (second, right-hand) sits completely
// past the page's right edge, and the home icon (first, left-hand)
// ends up ICON_GAP in from the true right edge.
function computeRestLeftOpen() {
    if (typeof window === "undefined") {
        return DRAG_TRAVEL_FALLBACK;
    }

    return (
        window.innerWidth -
        ICON_GAP -
        ICON_SIZE -
        PILL_PADDING
    );
}

// The real, on-screen distance the pill travels between its two
// resting positions, given the current viewport width.
function computeTravelDistance() {
    return Math.max(
        80,
        computeRestLeftOpen() - PILL_REST_LEFT_CLOSED
    );
}

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

    const pillRef = useRef(null);
    const fileInputRef = useRef(null);

    const dragData = useRef({
        dragging: false,
        moved: false,
        // "vertical" | "horizontal" | null — locked in once the
        // gesture crosses AXIS_LOCK_THRESHOLD on one axis, and never
        // re-evaluated for the rest of that drag.
        mode: null,
        // +1 when the gesture opens (started from the chat icon),
        // -1 when it closes (started from the home icon). Set once,
        // at pointerdown, and used to interpret every delta after.
        direction: 1,
        startX: 0,
        startY: 0,
        startCenterY: 0,
        // The real, measured distance (px) the pill travels between
        // its closed and open resting positions — computed fresh at
        // the start of each drag so "the far side" always means
        // exactly that, at any viewport size.
        travelDistance: DRAG_TRAVEL_FALLBACK,
    });

    const [isOpen, setIsOpen] =
        useState(false);

    // Vertical center (px) of the pill. Horizontal position is driven
    // entirely by drag progress — see PILL_REST_LEFT_CLOSED and
    // computeRestLeftOpen() above.
    const [centerY, setCenterY] = useState(() => {
        if (typeof window === "undefined") {
            return 320;
        }

        return window.innerHeight / 2;
    });

    // Transient offset (px) while a drag is in progress — how far the
    // current gesture has traveled toward its target so far. Always
    // snaps back to 0 on release; it's never a resting position.
    const [dragOffsetX, setDragOffsetX] = useState(0);

    // The real measured distance (px) the pill travels between its
    // two resting positions. Render uses this as the denominator for
    // drag progress, so "fully arrived" always lines up with reality.
    const [travelDistance, setTravelDistance] =
        useState(DRAG_TRAVEL_FALLBACK);

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

    useEffect(() => {
        loadMessages();
    }, []);

    // Keep the pill within the viewport, and the travel distance
    // accurate, if the window is resized.
    useEffect(() => {
        function handleResize() {
            const height =
                pillRef.current?.offsetHeight || PILL_HEIGHT;

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

            setTravelDistance(computeTravelDistance());
        }

        handleResize();

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
    | Dragging — the pill (vertical reposition + horizontal open/close)
    |--------------------------------------------------------------------------
    |
    | One set of handlers services both the chat icon (direction +1,
    | opens) and the home icon (direction -1, closes) — whichever one
    | is currently showing is the one that can start a gesture.
    |--------------------------------------------------------------------------
    */

    function handlePointerDown(event, direction) {
        if (event.button !== 0) return;

        // Only the icon currently at rest can start a gesture — the
        // chat icon opens (only while closed), the home icon closes
        // (only while open).
        if (direction === 1 && isOpen) return;
        if (direction === -1 && !isOpen) return;

        const pill = pillRef.current;

        if (!pill) return;

        const measuredTravel = computeTravelDistance();

        dragData.current = {
            dragging: true,
            moved: false,
            mode: null,
            direction,
            startX: event.clientX,
            startY: event.clientY,
            startCenterY: centerY,
            travelDistance: measuredTravel,
        };

        setTravelDistance(measuredTravel);
        setDragging(true);

        // Belt-and-braces on browsers that support it, but the real
        // fix for mobile/touch is below: tracking the drag on window
        // itself rather than relying on capture keeping events routed
        // to this ~44px button once the finger has moved off it.
        event.currentTarget.setPointerCapture?.(
            event.pointerId
        );

        window.addEventListener(
            "pointermove",
            handlePointerMove
        );

        window.addEventListener(
            "pointerup",
            handlePointerUp
        );

        // Mobile browsers can cancel a gesture mid-drag (a system
        // back-swipe, pull-to-refresh, an incoming call, etc.) — a
        // cancel has to clean up the same way an up does, or the drag
        // state gets stuck and the pill freezes mid-transition.
        window.addEventListener(
            "pointercancel",
            handlePointerCancel
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
        | horizontal drag from also nudging the pill up/down (and
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
            const pill =
                pillRef.current;

            const height =
                pill?.offsetHeight || PILL_HEIGHT;

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

        // Horizontal drag recognized — the pill now travels with the
        // pointer (1:1, clamped to the real distance between its two
        // resting positions), and vertical stays fully locked out no
        // matter how the pointer moves from here on. deltaX is
        // flipped by direction so "progress" always means "closer to
        // the target," whichever way that physically is.
        const travel = Math.max(
            0,
            Math.min(
                deltaX * data.direction,
                data.travelDistance
            )
        );

        setDragOffsetX(travel);
    }

    // Shared cleanup for both a real release and a cancelled gesture.
    function detachDragListeners() {
        window.removeEventListener(
            "pointermove",
            handlePointerMove
        );

        window.removeEventListener(
            "pointerup",
            handlePointerUp
        );

        window.removeEventListener(
            "pointercancel",
            handlePointerCancel
        );
    }

    // A cancelled gesture (the OS/browser interrupted it) always just
    // aborts and snaps back — never commits, regardless of how far it
    // had already traveled.
    function handlePointerCancel() {
        const data =
            dragData.current;

        if (!data.dragging) return;

        data.dragging = false;

        setDragging(false);
        setDragOffsetX(0);

        detachDragListeners();
    }

    function handlePointerUp(event) {
        const data =
            dragData.current;

        if (!data.dragging) return;

        data.dragging = false;

        setDragging(false);
        setDragOffsetX(0);

        detachDragListeners();

        /*
        |--------------------------------------------------------------------------
        | Plain tap → toggle
        |--------------------------------------------------------------------------
        */

        if (!data.moved) {
            if (data.direction === 1) openChat();
            else closeChat();

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Horizontal drag that reached (close to) the far side → commit
        |--------------------------------------------------------------------------
        |
        | Vertical drags just reposition the pill (already applied live
        | during the move above) and never open or close the chat. A
        | horizontal drag has to actually get most of the way across —
        | not just start moving that way — to commit.
        |
        */

        if (data.mode === "horizontal") {
            const deltaX =
                (event.clientX - data.startX) *
                data.direction;

            const progress =
                Math.min(1, deltaX / data.travelDistance);

            if (
                deltaX > OPEN_DRAG_THRESHOLD &&
                progress >= DRAG_COMMIT_PROGRESS
            ) {
                if (data.direction === 1) openChat();
                else closeChat();
            }
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
    | Open progress → everything
    |--------------------------------------------------------------------------
    |
    | One number drives the whole pill: 0 = fully closed (resting at
    | the left, chat icon showing), 1 = fully open (resting at the
    | right, home icon showing). Outside of an active drag it's just
    | whichever of those isOpen says; during a drag it's read live off
    | the gesture, in whichever direction that gesture is going.
    |
    | The pill itself never resizes and never clips its own content —
    | it's always the full width of both icons side by side. What
    | changes is purely its "left" position: at progress 0 it sits far
    | enough left that the home icon is entirely past the page's left
    | edge (hidden by the viewport itself, not by the pill); at
    | progress 1, mirrored, with the chat icon pushed off the right
    | edge instead. In between, both icons are genuinely on-screen at
    | once, in the same pill, side by side.
    |
    */

    const rawDragProgress =
        Math.min(1, dragOffsetX / travelDistance);

    const openProgress = dragging
        ? (isOpen ? 1 - rawDragProgress : rawDragProgress)
        : (isOpen ? 1 : 0);

    const pillLeft =
        PILL_REST_LEFT_CLOSED +
        openProgress * travelDistance;

    const pillStyle = {
        left: `${pillLeft}px`,
        top: `${centerY}px`,
    };

    // The chat panel tracks the exact same progress — sliding out as
    // the pill travels right, sliding back the moment you pull back
    // before letting go, in real time, whichever icon is driving it.
    const overlayStyle = {
        transform: `translateX(${(openProgress - 1) * 100}%)`,
    };

    return (
        <>
            {/* -------------------------------------------------
                PILL
                A fixed-size container holding both icons, always
                side by side — it never resizes and never clips its
                own content. What moves is purely its own on-screen
                position: at rest it sits mostly off one edge of the
                page, so the browser's own viewport boundary is what
                hides the inactive icon, not the pill itself. See
                the "Open progress → everything" block above.
            ------------------------------------------------- */}

            <div
                ref={pillRef}
                className={`floating-pill ${dragging
                    ? "floating-pill-dragging"
                    : ""
                    }`}
                style={pillStyle}
            >
                <div className="floating-pill-row">
                    <button
                        type="button"
                        className="floating-pill-icon floating-pill-icon-home"
                        onPointerDown={(event) =>
                            handlePointerDown(event, -1)
                        }
                        tabIndex={isOpen ? 0 : -1}
                        aria-hidden={!isOpen}
                        aria-label="Close community chat"
                        title="Drag left or tap to close"
                    >
                        <Home size={16} />
                    </button>

                    <button
                        type="button"
                        className="floating-pill-icon floating-pill-icon-chat"
                        onPointerDown={(event) =>
                            handlePointerDown(event, 1)
                        }
                        tabIndex={isOpen ? -1 : 0}
                        aria-hidden={isOpen}
                        aria-label="Open community chat"
                        title="Drag right or tap to open"
                    >
                        <MessageCircle
                            size={18}
                        />

                        <span className="floating-chat-online-dot" />

                        <ChevronsRight
                            size={10}
                            className="floating-chat-drag-hint"
                            aria-hidden="true"
                        />
                    </button>
                </div>
            </div>

            {/* -------------------------------------------------
                FULL-PAGE COMMUNITY CHAT OVERLAY
            ------------------------------------------------- */}

            <div
                className={`floating-chat-overlay ${isOpen
                    ? "floating-chat-overlay-open"
                    : ""
                    } ${dragging
                        ? "floating-chat-overlay-dragging"
                        : ""
                    }`}
                style={overlayStyle}
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