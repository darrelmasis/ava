import ChatMessage from './ChatMessage'

export default function ChatMessageGroup({
  userGroup,
  groupIndex,
  isOwnMessage,
  user,
  prevUserGroup,
  isFirstGroup,
}) {
  const firstMsg = userGroup.messages[0]
  const isOwn = isOwnMessage(firstMsg)
  const showAvatar =
    !isOwn &&
    (isFirstGroup ||
      !prevUserGroup ||
      String(prevUserGroup.userId) !== String(userGroup.userId))

  return (
    <div key={`${userGroup.userId}-${groupIndex}`} className="mb-1">
      {userGroup.messages.map((msg, msgIndex) => {
        const isFirstInGroup = msgIndex === 0
        const isLastInGroup = msgIndex === userGroup.messages.length - 1

        return (
          <ChatMessage
            key={msg.id || msg.timestamp}
            message={msg}
            isOwn={isOwn}
            isFirstInGroup={isFirstInGroup}
            isLastInGroup={isLastInGroup}
            showAvatar={showAvatar}
            user={user}
          />
        )
      })}
    </div>
  )
}

