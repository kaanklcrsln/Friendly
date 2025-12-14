// Firebase Chat Structure Guide

/*
DATABASE STRUCTURE:
==================

/chat
  /general
    /messages
      {messageId}:
        - text: "message content"
        - userId: "user_uid"
        - userEmail: "user@email.com"
        - timestamp: "2024-12-13T..."
        - displayName: "username"
  
  /private
    /messages
      /{conversationId}
        {messageId}:
          - text: "message content"
          - userId: "user_uid"
          - userEmail: "user@email.com"
          - timestamp: "2024-12-13T..."
          - displayName: "username"

/users
  /{userId}
    - email: "user@email.com"
    - displayName: "name"
    - friends:
        {friendId}: true
    - conversationIds:
        {conversationId}: true

SECURITY RULES:
===============

{
  "rules": {
    "chat": {
      "kişiler": {
        "genel": {
          "mesajlar": {
            ".read": "auth != null",
            ".write": "auth != null",
            "$messageId": {
              ".write": "root.child('chat/kişiler/genel/mesajlar').child($messageId).child('userId').val() === auth.uid || !data.exists()"
            }
          }
        },
        "özel": {
          "mesajlar": {
            "$conversationId": {
              ".read": "auth != null",
              ".write": "auth != null",
              "$messageId": {
                ".write": "root.child('chat/kişiler/özel/mesajlar').child($conversationId).child($messageId).child('userId').val() === auth.uid || !data.exists()"
              }
            }
          }
        }
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "$uid === auth.uid",
        "friends": {
          ".read": "auth != null",
          ".write": "$uid === auth.uid"
        }
      }
    }
  }
}

FRIEND SYSTEM:
==============
- Users can send friend requests
- Friends can have 1-on-1 private chats
- Conversation ID = alphabetically sorted [userId1, userId2].join('_')
- Both users must be friends to see private chat
*/
