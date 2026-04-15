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
- [ ] users can set a password for own created room
- [ ] users get usernames automatically if not written themselves
- [ ] performance improvement (rooms get deleted after time of inactivity, users get disconnected after time of inactivity)
- [ ] store rooms and history in databank