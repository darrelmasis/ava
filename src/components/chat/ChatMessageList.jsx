import ChatEmpty from './ChatEmpty'
import ChatDateSeparator from './ChatDateSeparator'
import ChatMessageGroup from './ChatMessageGroup'

export default function ChatMessageList({
  groupedMessages,
  isOwnMessage,
  user,
  messagesEndRef,
}) {
  const hasMessages = groupedMessages.length > 0

  return (
    <div className="chat-messages-container overflow-y-auto px-4 h-[calc(100vh-215px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {!hasMessages ? (
        <div className="flex flex-col items-center justify-center text-center">
          <ChatEmpty />
          <div ref={messagesEndRef} aria-hidden="true" style={{ height: 0 }} />
        </div>
      ) : (
        <>
          {groupedMessages.map(group => (
            <div key={group.date}>
              <ChatDateSeparator date={group.date} />

              {group.userGroups.map((userGroup, groupIndex) => {
                const isFirstGroup = groupIndex === 0
                const prevUserGroup =
                  groupIndex > 0 ? group.userGroups[groupIndex - 1] : null

                return (
                  <ChatMessageGroup
                    key={`${userGroup.userId}-${groupIndex}`}
                    userGroup={userGroup}
                    groupIndex={groupIndex}
                    isOwnMessage={isOwnMessage}
                    user={user}
                    prevUserGroup={prevUserGroup}
                    isFirstGroup={isFirstGroup}
                  />
                )
              })}
            </div>
          ))}
          <div ref={messagesEndRef} aria-hidden="true" style={{ height: 0 }} />
        </>
      )}
    </div>
  )
}
