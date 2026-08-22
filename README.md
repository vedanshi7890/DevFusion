
# DevFusion

## AI-Powered Developer Skill Intelligence & Career Roadmap Platform

DevFusion is a full-stack web application designed to help developers understand their current technical skills, identify improvement areas, and follow a personalized learning roadmap based on their career goals.

The platform combines a React frontend with a Spring Boot backend and MySQL database to provide a complete interactive developer growth experience.

---

## 🎯 Problem Statement

Students and beginner developers often learn multiple technologies without knowing:

- Which skills are strong
- Which skills need improvement
- How prepared they are for their desired career role
- What they should learn next
- Whether they are actually making progress

DevFusion addresses this problem by providing a centralized platform for skill analysis, career readiness estimation, personalized recommendations, and learning progress tracking.

---

## 💡 Proposed Solution

DevFusion analyzes a developer's technical skill levels and career goal to provide:

- Technical skill analysis
- Overall skill score
- Career readiness score
- Weakest skill identification
- Personalized career recommendation
- Interactive learning roadmap
- Roadmap progress tracking
- Learning history
- AI-style developer progress analysis

---

## 🚀 Key Features

### 1. Developer Registration

Users can create their developer profile by entering:

- Name
- Email
- Password
- Career Goal

The profile is stored in the backend database.

### 2. Developer Dashboard

The dashboard provides an overview of the developer's technical growth.

It displays:

- Overall Skill Score
- Career Readiness
- Skills Tracked
- Improvement Area

### 3. Technical Skill Intelligence

DevFusion displays the developer's technical skills with percentage-based scores.

Example:

- Java
- SQL
- React
- Spring Boot

Each skill is classified as:

- 🟢 Strong
- 🟡 Developing
- 🔴 Needs Improvement

### 4. Career Readiness

The platform calculates a career readiness percentage based on the developer's technical skills.

For backend developers, Spring Boot receives additional importance because it is a core backend technology.

### 5. Weakest Skill Detection

DevFusion automatically identifies the skill with the lowest score and displays it as the developer's primary improvement area.

### 6. Personalized Recommendation

The backend generates a recommendation based on the user's career goal and skill profile.

For example:

> Your improvement area is Spring Boot. Focus on REST APIs, CRUD operations, MySQL integration and Spring Security.

### 7. Interactive Learning Roadmap

The platform provides a backend development roadmap:

1. REST Controllers
2. CRUD APIs
3. MySQL Database
4. Spring Boot Security
5. Backend Deployment

Each roadmap step can be marked as completed.

### 8. Persistent Progress Tracking

Roadmap progress is stored in the backend database.

The system calculates:

```text
Completed Steps / Total Steps × 100