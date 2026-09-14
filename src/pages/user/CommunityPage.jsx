import { useEffect, useMemo, useRef, useState } from "react";
import {
    ArrowLeft,
    Camera,
    Check,
    ChevronDown,
    CircleHelp,
    Image as ImageIcon,
    MessageCircle,
    MoreHorizontal,
    Paperclip,
    Reply,
    Search,
    Send,
    ShieldCheck,
    Smile,
    Trash2,
    Users,
    X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import communityService from "../../services/mock/communityService";
import "./community.css";

import Loader from "../../components/common/Loader";

const CURRENT_USER_ID = "mock-user-001";

const QUICK_REACTIONS = [
    "👍",
    "❤️",
    "🔥",
    "😂",
    "👏",
    "💯",
];

function formatMessageTime(timestamp) {
    if (!timestamp) return "";

    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    }).format(new Date(timestamp));
}

function formatFileSize(bytes) {
    if (!bytes) return "0 KB";

    if (bytes < 1024 * 1024) {
        return `${Math.round(bytes / 1024)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Avatar({
    initials,
    online = false,
    size = "medium",
}) {
    return (
        <div
            className={`community-avatar community-avatar-${size}`}
        >
            <span>{initials}</span>

            {online && (
                <span className="community-avatar-status" />
            )}
        </div>
    );
}

function MessageBubble({
    message,
    onReply,
    onReaction,
}) {
    const isOwn =
        message.userId === CURRENT_USER_ID;

    return (
        <div
            className={`community-message-row ${isOwn
                ? "community-message-row-own"
                : ""
                }`}
        >
            {!isOwn && (
                <Avatar
                    initials={message.initials}
                    size="small"
                />
            )}

            <div className="community-message-content">
                <div
                    className={`community-message-bubble ${isOwn
                        ? "community-message-bubble-own"
                        : ""
                        }`}
                >
                    {!isOwn && (
                        <div className="community-message-author">
                            <strong>
                                {message.displayName}
                            </strong>

                            {message.role ===
                                "Top Earner" && (
                                    <span className="community-top-earner">
                                        Top Earner
                                    </span>
                                )}
                        </div>
                    )}

                    {message.replyTo && (
                        <div className="community-replied-message">
                            <div className="community-replied-line" />

                            <div>
                                <span>
                                    Replying to{" "}
                                    <strong>
                                        {
                                            message
                                                .replyTo
                                                .displayName
                                        }
                                    </strong>
                                </span>

                                <p>
                                    {
                                        message
                                            .replyTo
                                            .message
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {message.imageUrl && (
                        <div className="community-message-image">
                            <img
                                src={
                                    message.imageUrl
                                }
                                alt={
                                    message.message ||
                                    "Shared image"
                                }
                            />
                        </div>
                    )}

                    {message.message && (
                        <p className="community-message-text">
                            {message.message}
                        </p>
                    )}

                    <div className="community-message-meta">
                        <span>
                            {formatMessageTime(
                                message.timestamp
                            )}
                        </span>

                        {isOwn && (
                            <Check
                                size={14}
                            />
                        )}
                    </div>
                </div>

                <div className="community-message-actions">
                    <button
                        type="button"
                        className="community-message-action"
                        onClick={() =>
                            onReply(message)
                        }
                        title="Reply"
                    >
                        <Reply size={14} />
                        <span>Reply</span>
                    </button>

                    <div className="community-reaction-actions">
                        {QUICK_REACTIONS
                            .slice(0, 3)
                            .map((emoji) => (
                                <button
                                    key={emoji}
                                    type="button"
                                    className="community-mini-reaction"
                                    onClick={() =>
                                        onReaction(
                                            message.id,
                                            emoji
                                        )
                                    }
                                    title={`React ${emoji}`}
                                >
                                    {emoji}
                                </button>
                            ))}
                    </div>
                </div>

                {message.reactions?.length > 0 && (
                    <div className="community-reactions">
                        {message.reactions.map(
                            (reaction) => (
                                <button
                                    key={
                                        reaction.emoji
                                    }
                                    type="button"
                                    className={`community-reaction ${reaction.reacted
                                        ? "reacted"
                                        : ""
                                        }`}
                                    onClick={() =>
                                        onReaction(
                                            message.id,
                                            reaction.emoji
                                        )
                                    }
                                >
                                    <span>
                                        {
                                            reaction.emoji
                                        }
                                    </span>

                                    <span>
                                        {
                                            reaction.count
                                        }
                                    </span>
                                </button>
                            )
                        )}
                    </div>
                )}
            </div>

            {isOwn && (
                <Avatar
                    initials={message.initials}
                    size="small"
                />
            )}
        </div>
    );
}

function CommunityPage() {
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    const [community, setCommunity] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [members, setMembers] =
        useState([]);

    const [rules, setRules] =
        useState([]);

    const [user, setUser] =
        useState(null);

    const [searchTerm, setSearchTerm] =
        useState("");

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

    const [error, setError] =
        useState("");

    const [showMembers, setShowMembers] =
        useState(false);

    const [showRules, setShowRules] =
        useState(false);

    const [showEmojiPicker, setShowEmojiPicker] =
        useState(false);

    const [showQuickActions, setShowQuickActions] =
        useState(false);

    useEffect(() => {
        loadCommunity();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages.length]);

    async function loadCommunity() {
        try {
            setLoading(true);
            setError("");

            const response =
                await communityService.getCommunityPageData();

            if (!response?.success) {
                throw new Error(
                    response?.message ||
                    "Unable to load community."
                );
            }

            const data = response.data;

            setCommunity(data.info);
            setRules(data.rules || []);
            setMembers(data.members || []);
            setMessages(data.messages || []);
            setUser(data.user);
        } catch (err) {
            console.error(
                "Failed to load community:",
                err
            );

            setError(
                err?.message ||
                "We couldn't load the community."
            );
        } finally {
            setLoading(false);
        }
    }

    const filteredMessages = useMemo(() => {
        if (!searchTerm.trim()) {
            return messages;
        }

        const term =
            searchTerm
                .trim()
                .toLowerCase();

        return messages.filter(
            (message) =>
                message.message
                    ?.toLowerCase()
                    .includes(term) ||
                message.displayName
                    ?.toLowerCase()
                    .includes(term) ||
                message.username
                    ?.toLowerCase()
                    .includes(term)
        );
    }, [messages, searchTerm]);

    function handleOpenFilePicker() {
        fileInputRef.current?.click();
    }

    async function handleImageSelected(event) {
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

            toast.success(
                "Image attached."
            );
        } catch (err) {
            console.error(
                "Image attachment failed:",
                err
            );

            toast.error(
                "Unable to attach image."
            );
        } finally {
            setUploading(false);

            if (event.target) {
                event.target.value = "";
            }
        }
    }

    function removeAttachedImage() {
        if (imagePreview) {
            communityService.revokeCommunityImageUrl(
                imagePreview
            );
        }

        setAttachedImage(null);
        setImagePreview("");
    }

    function handleReply(message) {
        setReplyingTo(message);
        setShowEmojiPicker(false);

        setTimeout(() => {
            document
                .querySelector(
                    ".community-composer-input"
                )
                ?.focus();
        }, 50);
    }

    function cancelReply() {
        setReplyingTo(null);
    }

    async function handleSendMessage() {
        const trimmedMessage =
            messageText.trim();

        if (
            !trimmedMessage &&
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
                    trimmedMessage,
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
                ...current,
                response.data,
            ]);

            setMessageText("");
            setReplyingTo(null);
            removeAttachedImage();
            setShowEmojiPicker(false);

            toast.success("Message sent.");
        } catch (err) {
            console.error(
                "Failed to send message:",
                err
            );

            toast.error(
                err?.message ||
                "Unable to send message."
            );
        } finally {
            setSending(false);
        }
    }

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
        } catch (err) {
            console.error(
                "Reaction failed:",
                err
            );
        }
    }

    function insertEmoji(emoji) {
        setMessageText(
            (current) =>
                `${current}${emoji}`
        );

        document
            .querySelector(
                ".community-composer-input"
            )
            ?.focus();
    }

    function handleComposerKeyDown(event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();

            if (!sending) {
                handleSendMessage();
            }
        }
    }

    function getOnlineMembers() {
        return members.filter(
            (member) =>
                member.status === "online"
        );
    }

    if (loading) {
        return (
            <div className="community-page">
                <div className="community-loading">
                    <Loader
                        size="lg"
                        label="Loading community..."
                    />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="community-page">
                <div className="community-error-state">
                    <CircleHelp size={34} />

                    <h2>
                        Unable to load
                        community
                    </h2>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="community-primary-button"
                        onClick={loadCommunity}
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="community-page">
            <div className="community-page-header">
                <div className="community-header-left">
                    <Link
                        to="/dashboard"
                        className="community-back-button"
                    >
                        <ArrowLeft size={18} />
                    </Link>

                    <div>
                        <div className="community-title-row">
                            <h1>
                                {community?.name ||
                                    "Salok Community"}
                            </h1>

                            <span className="community-live-badge">
                                <span />
                                Live
                            </span>
                        </div>

                        <p>
                            {community?.description ||
                                "Connect with the Salok community."}
                        </p>
                    </div>
                </div>

                <div className="community-header-actions">
                    <div className="community-online-summary">
                        <div className="community-online-avatars">
                            {getOnlineMembers()
                                .slice(0, 3)
                                .map(
                                    (
                                        member
                                    ) => (
                                        <Avatar
                                            key={
                                                member.id
                                            }
                                            initials={
                                                member.initials
                                            }
                                            size="tiny"
                                            online
                                        />
                                    )
                                )}
                        </div>

                        <span>
                            {community?.onlineCount ||
                                0}{" "}
                            online
                        </span>
                    </div>

                    <button
                        type="button"
                        className="community-header-button"
                        onClick={() =>
                            setShowMembers(
                                true
                            )
                        }
                    >
                        <Users size={17} />
                        <span>
                            Members
                        </span>
                    </button>

                    <button
                        type="button"
                        className="community-header-button"
                        onClick={() =>
                            setShowRules(
                                true
                            )
                        }
                    >
                        <ShieldCheck
                            size={17}
                        />
                        <span>Rules</span>
                    </button>
                </div>
            </div>

            <div className="community-layout">
                <section className="community-chat-card">
                    <div className="community-chat-header">
                        <div className="community-chat-title">
                            <div className="community-chat-icon">
                                <MessageCircle
                                    size={19}
                                />
                            </div>

                            <div>
                                <strong>
                                    General Chat
                                </strong>

                                <span>
                                    Everyone can
                                    participate
                                </span>
                            </div>
                        </div>

                        <div className="community-chat-header-tools">
                            <div className="community-chat-search">
                                <Search
                                    size={16}
                                />

                                <input
                                    type="search"
                                    placeholder="Search messages..."
                                    value={
                                        searchTerm
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearchTerm(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />

                                {searchTerm && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSearchTerm(
                                                ""
                                            )
                                        }
                                    >
                                        <X
                                            size={
                                                14
                                            }
                                        />
                                    </button>
                                )}
                            </div>

                            <button
                                type="button"
                                className="community-more-button"
                                onClick={() =>
                                    setShowQuickActions(
                                        (
                                            current
                                        ) =>
                                            !current
                                    )
                                }
                            >
                                <MoreHorizontal
                                    size={19}
                                />
                            </button>
                        </div>
                    </div>

                    {showQuickActions && (
                        <div className="community-quick-actions-menu">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowQuickActions(
                                        false
                                    );
                                    setShowRules(
                                        true
                                    );
                                }}
                            >
                                <ShieldCheck
                                    size={16}
                                />
                                Community rules
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowQuickActions(
                                        false
                                    );
                                    setShowMembers(
                                        true
                                    );
                                }}
                            >
                                <Users
                                    size={16}
                                />
                                View members
                            </button>
                        </div>
                    )}

                    <div className="community-messages">
                        {filteredMessages.length ===
                            0 ? (
                            <div className="community-empty-state">
                                <MessageCircle
                                    size={34}
                                />

                                <h3>
                                    No messages
                                    found
                                </h3>

                                <p>
                                    Try another
                                    search or
                                    start the
                                    conversation.
                                </p>
                            </div>
                        ) : (
                            filteredMessages.map(
                                (message) => (
                                    <MessageBubble
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

                        <div
                            ref={
                                messagesEndRef
                            }
                        />
                    </div>

                    <div className="community-composer-area">
                        {replyingTo && (
                            <div className="community-reply-preview">
                                <div className="community-reply-preview-icon">
                                    <Reply
                                        size={16}
                                    />
                                </div>

                                <div className="community-reply-preview-content">
                                    <strong>
                                        Replying to{" "}
                                        {
                                            replyingTo.displayName
                                        }
                                    </strong>

                                    <p>
                                        {replyingTo.message ||
                                            "Image"}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={
                                        cancelReply
                                    }
                                    title="Cancel reply"
                                >
                                    <X
                                        size={
                                            17
                                        }
                                    />
                                </button>
                            </div>
                        )}

                        {attachedImage && (
                            <div className="community-image-preview">
                                <div className="community-image-preview-image">
                                    <img
                                        src={
                                            imagePreview
                                        }
                                        alt="Selected attachment"
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            removeAttachedImage
                                        }
                                        title="Remove image"
                                    >
                                        <X
                                            size={
                                                16
                                            }
                                        />
                                    </button>
                                </div>

                                <div className="community-image-preview-info">
                                    <strong>
                                        {
                                            attachedImage.name
                                        }
                                    </strong>

                                    <span>
                                        {formatFileSize(
                                            attachedImage.size
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}

                        {showEmojiPicker && (
                            <div className="community-emoji-picker">
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
                                            {emoji}
                                        </button>
                                    )
                                )}
                            </div>
                        )}

                        <div className="community-composer">
                            <input
                                ref={
                                    fileInputRef
                                }
                                type="file"
                                accept="image/*"
                                className="community-hidden-file-input"
                                onChange={
                                    handleImageSelected
                                }
                            />

                            <button
                                type="button"
                                className="community-composer-icon"
                                onClick={
                                    handleOpenFilePicker
                                }
                                disabled={
                                    uploading ||
                                    sending
                                }
                                title="Attach image"
                            >
                                {uploading ? (
                                    <span className="community-button-spinner" />
                                ) : (
                                    <Paperclip
                                        size={19}
                                    />
                                )}
                            </button>

                            <button
                                type="button"
                                className="community-composer-icon"
                                onClick={() =>
                                    setShowEmojiPicker(
                                        (
                                            current
                                        ) =>
                                            !current
                                    )
                                }
                                title="Add emoji"
                            >
                                <Smile
                                    size={19}
                                />
                            </button>

                            <textarea
                                className="community-composer-input"
                                placeholder={
                                    replyingTo
                                        ? "Write your reply..."
                                        : "Write a message..."
                                }
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
                                    handleComposerKeyDown
                                }
                                maxLength={1000}
                                rows={1}
                                disabled={
                                    sending
                                }
                            />

                            <span className="community-character-count">
                                {
                                    messageText.length
                                }
                                /1000
                            </span>

                            <button
                                type="button"
                                className="community-send-button"
                                onClick={
                                    handleSendMessage
                                }
                                disabled={
                                    sending ||
                                    uploading ||
                                    (!messageText.trim() &&
                                        !attachedImage)
                                }
                                title="Send message"
                            >
                                {sending ? (
                                    <span className="community-button-spinner" />
                                ) : (
                                    <Send
                                        size={18}
                                    />
                                )}
                            </button>
                        </div>

                        <div className="community-composer-hint">
                            <span>
                                <ImageIcon
                                    size={13}
                                />
                                Images up to
                                5 MB
                            </span>

                            <span>
                                Press Enter to
                                send
                            </span>
                        </div>
                    </div>
                </section>

                <aside className="community-sidebar">
                    <div className="community-side-card">
                        <div className="community-side-card-header">
                            <div>
                                <span className="community-section-eyebrow">
                                    Community
                                </span>

                                <h3>
                                    People online
                                </h3>
                            </div>

                            <span className="community-online-count">
                                {
                                    getOnlineMembers()
                                        .length
                                }
                            </span>
                        </div>

                        <div className="community-member-list">
                            {getOnlineMembers()
                                .slice(0, 6)
                                .map(
                                    (
                                        member
                                    ) => (
                                        <div
                                            className="community-member"
                                            key={
                                                member.id
                                            }
                                        >
                                            <Avatar
                                                initials={
                                                    member.initials
                                                }
                                                size="small"
                                                online
                                            />

                                            <div>
                                                <strong>
                                                    {
                                                        member.displayName
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        member.role
                                                    }
                                                </span>
                                            </div>

                                            <span className="community-member-earnings">
                                                {
                                                    member.earnings
                                                }{" "}
                                                SAK
                                            </span>
                                        </div>
                                    )
                                )}
                        </div>

                        <button
                            type="button"
                            className="community-view-all-button"
                            onClick={() =>
                                setShowMembers(
                                    true
                                )
                            }
                        >
                            View all members
                            <ChevronDown
                                size={16}
                            />
                        </button>
                    </div>

                    <div className="community-side-card community-safety-card">
                        <div className="community-safety-icon">
                            <ShieldCheck
                                size={21}
                            />
                        </div>

                        <div>
                            <h3>
                                Stay safe
                            </h3>

                            <p>
                                Never share your
                                password, private
                                keys or sensitive
                                account information
                                in chat.
                            </p>
                        </div>
                    </div>

                    <div className="community-side-card community-tip-card">
                        <div className="community-tip-icon">
                            <Camera size={19} />
                        </div>

                        <div>
                            <h3>
                                Share your
                                progress
                            </h3>

                            <p>
                                You can now share
                                screenshots and
                                other images
                                directly in the
                                community.
                            </p>
                        </div>
                    </div>
                </aside>
            </div>

            {showMembers && (
                <div
                    className="community-modal-backdrop"
                    onClick={() =>
                        setShowMembers(false)
                    }
                >
                    <div
                        className="community-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="community-modal-header">
                            <div>
                                <span className="community-section-eyebrow">
                                    Community
                                </span>

                                <h2>
                                    Members
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowMembers(
                                        false
                                    )
                                }
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="community-modal-list">
                            {members.map(
                                (member) => (
                                    <div
                                        className="community-member community-modal-member"
                                        key={
                                            member.id
                                        }
                                    >
                                        <Avatar
                                            initials={
                                                member.initials
                                            }
                                            size="medium"
                                            online={
                                                member.status ===
                                                "online"
                                            }
                                        />

                                        <div>
                                            <strong>
                                                {
                                                    member.displayName
                                                }
                                            </strong>

                                            <span>
                                                @
                                                {
                                                    member.username
                                                }{" "}
                                                ·{" "}
                                                {
                                                    member.role
                                                }
                                            </span>
                                        </div>

                                        <span className="community-member-status">
                                            {
                                                member.status
                                            }
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showRules && (
                <div
                    className="community-modal-backdrop"
                    onClick={() =>
                        setShowRules(false)
                    }
                >
                    <div
                        className="community-modal community-rules-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="community-modal-header">
                            <div>
                                <span className="community-section-eyebrow">
                                    Guidelines
                                </span>

                                <h2>
                                    Community
                                    Rules
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    setShowRules(
                                        false
                                    )
                                }
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <div className="community-rules-list">
                            {rules.map(
                                (
                                    rule,
                                    index
                                ) => (
                                    <div
                                        className="community-rule"
                                        key={
                                            rule
                                        }
                                    >
                                        <span>
                                            {String(
                                                index +
                                                1
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                        <p>
                                            {rule}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CommunityPage;