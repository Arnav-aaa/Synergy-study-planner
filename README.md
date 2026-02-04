# SYNERGY – Real-Time Collaborative Study Planner

## Project Overview
SYNERGY is a web-based application designed to support collaborative learning by
combining real-time mind mapping and structured task management into a single
platform. The system enables students to brainstorm ideas together, convert those
ideas into actionable tasks, and track group progress in real time.

---

## Problem It Solves
Students working in groups often rely on multiple disconnected tools for planning,
brainstorming, and task execution. This fragmented approach leads to unclear
responsibilities, duplicated efforts, and inefficient collaboration. SYNERGY
addresses this problem by providing a unified environment that integrates visual
idea organization with task tracking and real-time collaboration.

---

## Target Users (Personas)
- Undergraduate students working in collaborative study groups  
- Postgraduate students collaborating on academic projects or research  
- Group owners who manage study sessions and assign tasks  
- Group members who contribute ideas and complete assigned tasks  

---

## Vision Statement
To create a unified, intuitive, and real-time collaborative study platform that
enhances group productivity by seamlessly integrating mind mapping, task
management, and progress tracking.

---

## Key Features / Goals
- Secure user authentication and role-based authorization  
- Create and join collaborative study groups  
- Real-time collaborative mind map creation and editing  
- Convert mind map nodes into actionable study tasks  
- Task assignment, deadlines, and status tracking  
- Live synchronization of updates across all group members  
- Progress tracking and visualization for study groups  

---

## Success Metrics
- Real-time updates delivered with minimal latency  
- At least 85% of users can complete core tasks without assistance  
- Accurate data persistence across sessions and devices  
- Successful collaboration among multiple concurrent users per group  
- Positive usability feedback from student users  

---

## Assumptions & Constraints
- Users have access to modern web browsers (Chrome, Firefox, Edge, Safari)  
- Stable internet connectivity is available for real-time collaboration  
- The system uses only free and open-source technologies  
- Development is constrained to a single academic semester  
- The application must support concurrent editing with conflict resolution  

## MoSCoW Prioritization

### Must Have
- User registration and login
- Create and join study groups
- Real-time collaborative mind map editor
- Convert mind map nodes into tasks
- Task assignment and status tracking
- Persistent storage using database

### Should Have
- Real-time synchronization using WebSockets
- Role-based access control
- Progress tracking dashboard
- Conflict detection during concurrent edits

### Could Have
- Notifications for task updates
- Export mind map as image or JSON
- UI customization options

### Won’t Have (For Now)
- Advanced analytics and reports
- Mobile application
- AI-based study recommendations

## Branching Strategy

This project follows GitHub Flow.

- The `main` branch contains stable code.
- Feature branches are created for development and setup tasks.

Example feature branch:
- feature/dev-setup
