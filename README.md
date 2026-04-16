# Multiple-Rooms Chat
A TCP chat that allows people to join different rooms and message each other

## Project Goals
- learn dynamic server state-management

## Tech Stack
- **Backend**: Node.js

## Current Status
- [X] initial setup
- [X] basic server & client connection
- [X] socket distribution in different rooms logic
- [X] users can leave rooms, create own rooms and set properties like max users
- [X] add /help command with a list of all commands
- [X] users get usernames automatically if not written themselves
- [X] add /username command to setup custom username
- [X] add notifications inside room who joined / left
- [X] implement data buffer for safe tcp data transfer
- [ ] users can set a password for own created room
- [ ] add prefix owner to creator of room, let owner have admin rights e.g kick, ban
- [ ] performance improvement (Garbage collection - rooms get deleted after time of inactivity, users get disconnected after time of inactivity)
- [ ] store rooms and history in databank