import {
    ArrowUpRight,
    ChevronDown,
    Image as ImageIcon,
    MessageCircle,
    Paperclip,
    Reply,
    Send,
    Smile,
    X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import communityService from "../../services/mock/communityService";

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
    const launcherRef = useRef(null);
    const fileInputRef = useRef(null);

    const dragData = useRef({
        dragging: false,
        moved: false,
        startX: 0,
        startY: 0,
        startLeft: 0,
        startTop: 0,
    });

    const [isOpen, setIsOpen] =
        useState(false);

    const [position, setPosition] =
        useState({
            right: 24,
            bottom: 24,
        });

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
    | Dragging
    |--------------------------------------------------------------------------
    */

    function handlePointerDown(event) {
        if (event.button !== 0) return;

        const launcher =
            launcherRef.current;

        if (!launcher) return;

        const rect =
            launcher.getBoundingClientRect();

        dragData.current = {
            dragging: true,
            moved: false,
            startX: event.clientX,
            startY: event.clientY,
            startLeft: rect.left,
            startTop: rect.top,
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

        if (
            Math.abs(deltaX) > 5 ||
            Math.abs(deltaY) > 5
        ) {
            data.moved = true;
        }

        const launcher =
            launcherRef.current;

        if (!launcher) return;

        const width =
            launcher.offsetWidth;

        const height =
            launcher.offsetHeight;

        const viewportWidth =
            window.innerWidth;

        const viewportHeight =
            window.innerHeight;

        let newLeft =
            data.startLeft + deltaX;

        let newTop =
            data.startTop + deltaY;

        const margin = 12;

        newLeft = Math.max(
            margin,
            Math.min(
                newLeft,
                viewportWidth -
                width -
                margin
            )
        );

        newTop = Math.max(
            margin,
            Math.min(
                newTop,
                viewportHeight -
                height -
                margin
            )
        );

        setPosition({
            left: newLeft,
            top: newTop,
        });
    }

    function handlePointerUp(event) {
        const data =
            dragData.current;

        if (!data.dragging) return;

        data.dragging = false;

        setDragging(false);

        const deltaY =
            event.clientY -
            data.startY;

        const wasMoved =
            data.moved;

        /*
        |--------------------------------------------------------------------------
        | Vertical drag gesture
        |--------------------------------------------------------------------------
        |
        | Drag upward significantly → open
        | Drag downward significantly → close
        |
        */

        if (Math.abs(deltaY) > 80) {
            if (deltaY < 0) {
                openChat();
            } else {
                closeChat();
            }

            return;
        }

        /*
        |--------------------------------------------------------------------------
        | Normal click
        |--------------------------------------------------------------------------
        */

        if (!wasMoved) {
            toggleChat();
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
        }, 80);
    }

    function closeChat() {
        setIsOpen(false);
        setShowEmojiPicker(false);
    }

    function toggleChat() {
        if (isOpen) {
            closeChat();
        } else {
            openChat();
        }
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

    const launcherStyle =
        position.left !== undefined
            ? {
                left: `${position.left}px`,
                top: `${position.top}px`,
                right: "auto",
                bottom: "auto",
            }
            : {
                right: `${position.right}px`,
                bottom: `${position.bottom}px`,
            };

    return (
        <>
            {isOpen && (
                <div className="floating-chat-panel">
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
                                <ChevronDown
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
            )}

            <button
                ref={launcherRef}
                type="button"
                className={`floating-chat-launcher ${isOpen
                        ? "floating-chat-launcher-open"
                        : ""
                    } ${dragging
                        ? "floating-chat-launcher-dragging"
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
                aria-label={
                    isOpen
                        ? "Close community chat"
                        : "Open community chat"
                }
                title={
                    isOpen
                        ? "Close community chat"
                        : "Open community chat"
                }
            >
                <MessageCircle
                    size={23}
                />

                {!isOpen && (
                    <span className="floating-chat-online-dot" />
                )}

                <span className="floating-chat-drag-label">
                    {isOpen
                        ? "Close"
                        : "Chat"}
                </span>
            </button>
        </>
    );
}

export default FloatingChat;