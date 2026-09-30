import { useState } from 'react'
import './App.css'
import Assessment from './Assessment'

function App() {
  const [started, setStarted] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false)
  const [dashboard, setDashboard] = useState(false)
 const [showAssessment, setShowAssessment] = useState(false)
 const [assessmentSkill, setAssessmentSkill] = useState("Java")
  const [skills, setSkills] = useState([])
 const [history, setHistory] = useState([])
const [analysis, setAnalysis] = useState(null)
const [assessmentHistory, setAssessmentHistory] = useState([])
const [userId, setUserId] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [recommendation, setRecommendation] = useState('')
  const [showRoadmap, setShowRoadmap] = useState(false)
  const [showRecommendationDetails, setShowRecommendationDetails] = useState(false)
  const [completedSteps, setCompletedSteps] = useState([])

  const [roadmapLoading, setRoadmapLoading] = useState(false)
  const [roadmapSaving, setRoadmapSaving] = useState(false)
  const [roadmapError, setRoadmapError] = useState('')
  const roadmapProgress = Math.round(
  (completedSteps.length / 5) * 100
)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    careerGoal: ''
  })

  const [registerError, setRegisterError] = useState('')
  const [registerLoading, setRegisterLoading] = useState(false)

  async function loadSkills() {
    try {
        const response = await fetch(
            `http://localhost:8080/api/skills/${userId}`
        )

        if (!response.ok) {
            throw new Error('Failed to load skills')
        }

        const data = await response.json()

        console.log("User Skills:", data)

        setSkills(data)

    } catch (error) {
        console.error('Error loading skills:', error)
        setSkills([])
    }
}
  async function loadHistory(id) {

  try {

    const response = await fetch(
  `http://localhost:8080/api/history/${id}`
)

    if(!response.ok){
      throw new Error("Failed to load history")
    }

    const data = await response.json()

    setHistory(data)

  } catch(error) {

    console.error(
      "Error loading history:",
      error
    )

    setHistory([])

  }

}

async function loadAssessmentHistory(id) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/assessment-history/${id}`
    )

    if (!response.ok) {
      throw new Error("Failed to load assessment history")
    }

    const data = await response.json()

    setAssessmentHistory(data)

  } catch (error) {
    console.error("Error loading assessment history:", error)
    setAssessmentHistory([])
  }
}
async function loadAnalysis(id){

  try {

    const response = await fetch(
      `http://localhost:8080/api/analysis/${id}`
    )

    if(!response.ok){
      throw new Error("Failed to load analysis")
    }


    const data = await response.json()

    console.log("AI Analysis:", data)

    setAnalysis(data)


  } catch(error){

    console.error(
      "Error loading analysis:",
      error
    )

  }

}

function loadRecommendation(careerGoal) {

    if (!skills || skills.length === 0) {
        setRecommendation(
            "Complete your skill assessments to receive a personalized recommendation."
        )
        return
    }

    let relevantSkills = skills

    if (careerGoal === "Backend Developer") {

        relevantSkills = skills.filter(
            (skill) =>
                skill.name === "Java" ||
                skill.name === "SQL" ||
                skill.name === "Spring Boot"
        )

    } else if (careerGoal === "Frontend Developer") {

        relevantSkills = skills.filter(
            (skill) =>
                skill.name === "JavaScript" ||
                skill.name === "React"
        )

    } else if (careerGoal === "Full Stack Developer") {

        relevantSkills = skills

    }

    if (relevantSkills.length === 0) {
        setRecommendation(
            "Complete more skill assessments to receive a personalized recommendation."
        )
        return
    }

    let weakestSkill = relevantSkills[0]

    for (let i = 1; i < relevantSkills.length; i++) {

        if (relevantSkills[i].score < weakestSkill.score) {
            weakestSkill = relevantSkills[i]
        }

    }

    let message = ""

    if (weakestSkill.name === "Java") {

        message =
            "Your improvement area is Java. Focus on OOP concepts, collections, exception handling, multithreading and advanced Java programming."

    } else if (weakestSkill.name === "SQL") {

        message =
            "Your improvement area is SQL. Focus on joins, subqueries, aggregation, indexing, query optimization and database design."

    } else if (weakestSkill.name === "React") {

        message =
            "Your improvement area is React. Focus on components, state management, hooks, API integration and modern React patterns."

    } else if (weakestSkill.name === "Spring Boot") {

        message =
            "Your improvement area is Spring Boot. Focus on REST APIs, CRUD operations, MySQL integration, Spring Security and backend deployment."

    } else {

        message =
            `Your improvement area is ${weakestSkill.name}. Continue practicing this skill to improve your career readiness.`

    }

    setRecommendation(message)
}

  async function loadRoadmapProgress(id,skill) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/roadmap/${id}/${skill}`
    )

    if (!response.ok) {
      throw new Error('Failed to load roadmap progress')
    }

    const data = await response.json()

    const steps = data.completedSteps
    ? data.completedSteps
        .split(',')
        .filter((step) => step !== '')
        .map(Number)
    : []

setCompletedSteps(steps)

await loadHistory(id)

  } catch (error) {
    console.error('Error loading roadmap progress:', error)
  }

}


  async function toggleRoadmapStep(step) {
    if (!userId || roadmapSaving) {
      return
    }

    const nextSteps = completedSteps.includes(step)
      ? completedSteps.filter((completedStep) => completedStep !== step)
      : [...completedSteps, step]

    setRoadmapSaving(true)
    setRoadmapError('')

    try {
      const response = await fetch(`http://localhost:8080/api/roadmap/${userId}/${getWeakestSkill()?.name}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
  completedSteps: nextSteps.join(","),
  progressPercentage: Math.round((nextSteps.length / 5) * 100)
})
      })

      if (!response.ok) {
        throw new Error('Failed to save roadmap progress')
      }

      const data = await response.json()
      


setCompletedSteps(
  data.completedSteps
    .split(",")
    .filter((step) => step !== "")
    .map(Number)
)
 
    } catch (error) {
      console.error('Error saving roadmap progress:', error)
      setRoadmapError('Unable to save your roadmap progress. Please try again.')
    } finally {
      setRoadmapSaving(false)
    }
  }

  async function loadUserProfile(id) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/users/${id}`
    )

    if (!response.ok) {
      throw new Error('Failed to load user profile')
    }

    const data = await response.json()

    setUserProfile(data)
    await loadRecommendation(data.careerGoal)

  } catch (error) {
    console.error('Error loading user profile:', error)
  }
}

  function handleInputChange(event) {
    const { name, value } = event.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  async function handleCreateAccount(event) {
  event.preventDefault()

  setRegisterError('')
  setRegisterLoading(true)

  try {
    const requestData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      careerGoal: formData.careerGoal
    }

    console.log("Sending registration data:", requestData)

    const response = await fetch(
      'http://localhost:8080/api/users',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }
    )

    if (response.status === 409) {
      setRegisterError('This email is already registered.')
      setRegisterLoading(false)
      return
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      throw new Error('Failed to create account')
    }

    const savedUser = await response.json()

    console.log("Account created:", savedUser)

    setUserId(savedUser.id)
    setAccountCreated(true)

  } catch (error) {
    console.error('Registration error:', error)

    setRegisterError(
      'Unable to create account. Please make sure all fields are filled and the backend is running.'
    )
  } finally {
    setRegisterLoading(false)
  }
}
async function handleContinue() {

  try {

    const skillsResponse = await fetch(
      `http://localhost:8080/api/skills/${userId}`
    )

    if (!skillsResponse.ok) {
      throw new Error("Failed to load skills")
    }

    const skillsData = await skillsResponse.json()

    setSkills(skillsData)

    const response = await fetch(
      `http://localhost:8080/api/users/${userId}`
    )

    if (!response.ok) {
      throw new Error("Failed to load user")
    }

    const data = await response.json()

    setUserProfile(data)

    let relevantSkills = skillsData

    if (data.careerGoal === "Backend Developer") {

      relevantSkills = skillsData.filter(
        (skill) =>
          skill.name === "Java" ||
          skill.name === "SQL" ||
          skill.name === "Spring Boot"
      )

    } else if (data.careerGoal === "Frontend Developer") {

      relevantSkills = skillsData.filter(
        (skill) =>
          skill.name === "React"
      )

    } else if (data.careerGoal === "Full Stack Developer") {

      relevantSkills = skillsData

    }

    if (relevantSkills.length > 0) {

      let weakestSkill = relevantSkills[0]

      for (let i = 1; i < relevantSkills.length; i++) {

        if (
          relevantSkills[i].score <
          weakestSkill.score
        ) {
          weakestSkill = relevantSkills[i]
        }

      }

      if (weakestSkill.name === "Java") {

        setRecommendation(
          "Your improvement area is Java. Focus on OOP concepts, collections, exception handling, multithreading and advanced Java programming."
        )

      } else if (weakestSkill.name === "SQL") {

        setRecommendation(
          "Your improvement area is SQL. Focus on joins, subqueries, aggregation, indexing, query optimization and database design."
        )

      } else if (weakestSkill.name === "Spring Boot") {

        setRecommendation(
          "Your improvement area is Spring Boot. Focus on REST APIs, CRUD operations, MySQL integration, Spring Security and backend deployment."
        )

      } else if (weakestSkill.name === "React") {

        setRecommendation(
          "Your improvement area is React. Focus on components, state management, hooks, API integration and modern React patterns."
        )

      } else {

        setRecommendation(
          `Your improvement area is ${weakestSkill.name}. Continue practicing this skill to improve your career readiness.`
        )

      }

      console.log("Weakest skill:", weakestSkill.name)

      await loadRoadmapProgress(
        userId,
        weakestSkill.name
      )

    } else {

      setRecommendation(
        "Complete your skill assessments to receive a personalized recommendation."
      )

    }

    await loadHistory(userId)

    await loadAnalysis(userId)
    await loadAssessmentHistory(userId)

    setDashboard(true)

  } catch (error) {

    console.error(
      "Error loading dashboard:",
      error
    )

  }
}

  function calculateAverage() {
    if (skills.length === 0) {
      return 0
    }

    let total = 0

    for (let i = 0; i < skills.length; i++) {
      total = total + skills[i].score
    }

    return Math.round(total / skills.length)
  }

  function calculateAssessmentAverage() {

  if (assessmentHistory.length === 0) {
    return 0
  }

  let total = 0

  for (let i = 0; i < assessmentHistory.length; i++) {
    total = total + assessmentHistory[i].score
  }

  return Math.round(
    total / assessmentHistory.length
  )
}

function getSkillAverage(skill) {

  const skillAttempts = assessmentHistory.filter(
    attempt => attempt.skill === skill
  )

  if (skillAttempts.length === 0) {
    return 0
  }

  let total = 0

  for (let i = 0; i < skillAttempts.length; i++) {
    total = total + skillAttempts[i].score
  }

  return Math.round(total / skillAttempts.length)
}

function getProgressTrend() {

  if (assessmentHistory.length < 2) {
    return "Not enough data"
  }

  const latest =
    assessmentHistory[0].score

  const previous =
    assessmentHistory[1].score

  if (latest > previous) {
    return "Improving"
  }

  if (latest < previous) {
    return "Declining"
  }

  return "Stable"
}
function getAchievements() {

  const achievements = []

  if (assessmentHistory.length >= 1) {
    achievements.push({
      name: "First Assessment",
      unlocked: true,
      message: "First assessment completed"
    })
  }

  if (assessmentHistory.length >= 5) {
    achievements.push({
      name: "5 Assessments",
      unlocked: true,
      message: "Completed 5 assessments"
    })
  } else {
    achievements.push({
      name: "5 Assessments",
      unlocked: false,
      message: `${5 - assessmentHistory.length} more assessment needed`
    })
  }

  const attemptedSkills = []

  for (let i = 0; i < assessmentHistory.length; i++) {

    if (!attemptedSkills.includes(assessmentHistory[i].skill)) {
      attemptedSkills.push(assessmentHistory[i].skill)
    }

  }

  if (attemptedSkills.length >= 4) {
    achievements.push({
      name: "Skill Explorer",
      unlocked: true,
      message: "Attempted all 4 skills"
    })
  } else {
    achievements.push({
      name: "Skill Explorer",
      unlocked: false,
      message: "Attempt all 4 skills"
    })
  }

  if (assessmentHistory.length >= 2) {

    const latest = assessmentHistory[0].score
    const previous = assessmentHistory[1].score

    if (latest > previous) {
      achievements.push({
        name: "Improving Developer",
        unlocked: true,
        message: "Recent score improved"
      })
    } else {
      achievements.push({
        name: "Improving Developer",
        unlocked: false,
        message: "Improve your next assessment score"
      })
    }

  } else {
    achievements.push({
      name: "Improving Developer",
      unlocked: false,
      message: "Complete another assessment"
    })
  }

  return achievements
}

function getBestScore() {

  if (assessmentHistory.length === 0) {
    return 0
  }

  let best = 0

  for (let i = 0; i < assessmentHistory.length; i++) {

    if (assessmentHistory[i].score > best) {
      best = assessmentHistory[i].score
    }

  }

  return best
}
function getStrongestSkill() {

  const skillsToCheck = [
    "Java",
    "SQL",
    "React",
    "Spring Boot"
  ]

  let strongestSkill = "None"
  let highestScore = -1

  for (let i = 0; i < skillsToCheck.length; i++) {

    const score = getSkillAverage(skillsToCheck[i])

    if (score > highestScore && score > 0) {
      highestScore = score
      strongestSkill = skillsToCheck[i]
    }

  }

  return strongestSkill
}

function getFocusSkill() {

  const skillsToCheck = [
    "Java",
    "SQL",
    "React",
    "Spring Boot"
  ]

  let focusSkill = "None"
  let lowestScore = 101

  for (let i = 0; i < skillsToCheck.length; i++) {

    const score = getSkillAverage(skillsToCheck[i])

    if (
      assessmentHistory.some(
        attempt => attempt.skill === skillsToCheck[i]
      ) &&
      score < lowestScore
    ) {
      lowestScore = score
      focusSkill = skillsToCheck[i]
    }

  }

  return focusSkill
}


  function calculateCareerReadiness() {

  if (skills.length === 0) {
    return 0
  }

  let total = 0
  let weight = 0

  for (let i = 0; i < skills.length; i++) {

    if (
      userProfile?.careerGoal === "Backend Developer"
    ) {

      if (
        skills[i].name === "Spring Boot"
      ) {
        total = total + skills[i].score * 1.5
        weight = weight + 1.5
      }
      else {
        total = total + skills[i].score
        weight = weight + 1
      }

    }
    else {

      total = total + skills[i].score
      weight = weight + 1

    }

  }

  return Math.round(total / weight)

}
function getReadinessStatus() {
  const readiness = calculateCareerReadiness()

  if (readiness >= 80) {
    return '🚀 Highly Ready'
  }

  if (readiness >= 60) {
    return '📈 Good Progress'
  }

  return '🎯 Needs Improvement'
}
function getSkillStatus(score) {
  if (score >= 80) {
    return '🟢 Strong'
  }

  if (score >= 60) {
    return '🟡 Developing'
  }

  return '🔴 Needs Improvement'
}
function getWeakestSkill() {

  if(skills.length === 0){
    return null
  }

  let weakest = skills[0]

  for(let i = 1; i < skills.length; i++){

    if(skills[i].score < weakest.score){
      weakest = skills[i]
    }

  }

  return weakest

}
  if (dashboard) {
    if (showAssessment) {
    return (
        <div className="app">

            <nav className="navbar">
                <div className="logo">
                    DevFusion
                </div>

                <div className="nav-links">
                    <button
                        className="back-button"
                        onClick={() => setShowAssessment(false)}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </nav>
<Assessment
    userId={userId}
    skill={assessmentSkill}
   onComplete={async () => {

    setShowAssessment(false)

    const response = await fetch(
        `http://localhost:8080/api/skills/${userId}`
    )

    if (response.ok) {

        const data = await response.json()

        setSkills(data)

        let relevantSkills = data

        if (
            userProfile?.careerGoal === "Backend Developer"
        ) {

            relevantSkills = data.filter(
                (skill) =>
                    skill.name === "Java" ||
                    skill.name === "SQL" ||
                    skill.name === "Spring Boot"
            )

        }

        if (relevantSkills.length > 0) {

            let weakestSkill = relevantSkills[0]

            for (let i = 1; i < relevantSkills.length; i++) {

                if (
                    relevantSkills[i].score <
                    weakestSkill.score
                ) {
                    weakestSkill = relevantSkills[i]
                }

            }

            if (weakestSkill.name === "Java") {

                setRecommendation(
                    "Your improvement area is Java. Focus on OOP concepts, collections, exception handling, multithreading and advanced Java programming."
                )

            } else if (weakestSkill.name === "SQL") {

                setRecommendation(
                    "Your improvement area is SQL. Focus on joins, subqueries, aggregation, indexing, query optimization and database design."
                )

            } else if (weakestSkill.name === "Spring Boot") {

                setRecommendation(
                    "Your improvement area is Spring Boot. Focus on REST APIs, CRUD operations, MySQL integration, Spring Security and backend deployment."
                )

            } else if (weakestSkill.name === "React") {

                setRecommendation(
                    "Your improvement area is React. Focus on components, state management, hooks, API integration and modern React patterns."
                )

            }

        }

    }

    await loadHistory(userId)
    await loadAnalysis(userId)
    await loadAssessmentHistory(userId)
}}
/>

        </div>
    )
}
    return (
      <div className="app">

        <nav className="navbar">
          <div className="logo">DevFusion</div>

          <div className="nav-links">
            <a href="#dashboard">Dashboard</a>
            <a href="#skills">My Skills</a>
            <a href="#recommendations">Recommendations</a>
          </div>
        </nav>

        <main className="dashboard-page" id="dashboard">

          <div className="dashboard-header">

            <div>
              <p className="section-label">
                YOUR DEVELOPER PROFILE
              </p>

              <h1>
               Welcome back, {userProfile?.name || 'Developer'} 👋
              </h1>

              <p>
                Here is an overview of your current technical growth.
              </p>
            </div>

            <button
              className="back-button"
              onClick={() => setDashboard(false)}
            >
              ← Back
            </button>

          </div>
          <section className="profile-card">

  <p className="section-label">
    PROFILE INFORMATION
  </p>

  <h2>
    Developer Profile
  </h2>

  <div className="profile-details">
    <p>
      Name: {userProfile?.name}
    </p>

    <p>
      Email: {userProfile?.email}
    </p>

    <p>
      Career Goal: {userProfile?.careerGoal}
    </p>

    <p>
      Role: {userProfile?.role}
    </p>
  </div>

</section>

          <section className="dashboard-stats">

            <div className="stat-card">
              <span>Current Skill Score</span>

              <strong>{calculateAverage()}%</strong>

              <small>
                {skills.length > 0
                  ? 'Based on your current skill scores'
                  : 'No skills available'}
              </small>
            </div>

            <div className="stat-card">
              <span>Career Readiness</span>

             <strong>{calculateCareerReadiness()}%</strong>

              <small>
  {getReadinessStatus()} · Based on {skills.length} tracked skills
</small>
            </div>

            <div className="stat-card">
              <span>Skills Tracked</span>

              <strong>{skills.length}</strong>

              <small>
                {skills.length > 0
                  ? 'Skills analyzed'
                  : 'Keep learning'}
              </small>
            </div>
           <div className="stat-card">

  <span>
    Improvement Area
  </span>

  <strong>
    {getWeakestSkill()?.name || "N/A"}
  </strong>

  <small>
    {getWeakestSkill()
      ? getWeakestSkill().score + "% skill level"
      : "No data"}
  </small>

</div> 

          </section>

          <section
            className="dashboard-section"
            id="skills"
          >

            <div className="dashboard-title">

              <div>
                <p className="section-label">
                  SKILL INTELLIGENCE
                </p>

                <h2>Your Technical Skills</h2>
              </div>

            </div>
<div className="assessment-buttons">

    <button
        className="hero-button"
        onClick={() => {
            setAssessmentSkill("Java")
            setShowAssessment(true)
        }}
    >
        🧠 Take Java Assessment
    </button>

    <button
        className="hero-button"
        onClick={() => {
            setAssessmentSkill("SQL")
            setShowAssessment(true)
        }}
    >
        🗄️ Take SQL Assessment
    </button>

    <button
        className="hero-button"
        onClick={() => {
            setAssessmentSkill("React")
            setShowAssessment(true)
        }}
    >
        ⚛️ Take React Assessment
    </button>

    <button
        className="hero-button"
        onClick={() => {
            setAssessmentSkill("Spring Boot")
            setShowAssessment(true)
        }}
    >
        🌱 Take Spring Boot Assessment
    </button>

</div>
          <div className="dashboard-skills">

  {skills.map((skill) => (

    <div
      className="dashboard-skill"
      key={skill.id}
    >

      <div className="skill-card-header">

        <div>
          <span>{skill.name}</span>

          <small>
            {getSkillStatus(skill.score)}
          </small>
        </div>

        <strong>
          {skill.score}%
        </strong>

      </div>

      <div className="progress">

        <div
          className="progress-fill java"
          style={{
            width: skill.score + '%'
          }}
        >
        </div>

      </div>

      <p className="skill-card-message">

        {skill.score >= 80
          ? "Excellent performance. Keep maintaining this skill."
          : skill.score >= 60
          ? "Good progress. Continue practicing to strengthen this skill."
          : "Needs improvement. Focus on learning and regular practice."}

      </p>

    </div>

  ))}

</div>

          </section>

          <section
            className="recommendation-panel"
            id="recommendations"
          >

            <div>

              <p className="section-label">
                NEXT RECOMMENDATION
              </p>

              <h2>
  {recommendation || "Loading recommendation..."}
</h2>

<p>
  Personalized recommendation based on your career goal.
</p>
<button
  className="hero-button"
  onClick={() => {
    setShowRecommendationDetails(
      !showRecommendationDetails
    )
  }}
>
  {showRecommendationDetails
    ? "Hide Recommendation"
    : "View Recommendation"}
</button>
<button
  className="hero-button"
  onClick={() => {
  setShowRoadmap(true)
  loadRoadmapProgress(
    userId,
    getWeakestSkill()?.name
  )
}}
>
  View Learning Roadmap
</button>
{showRecommendationDetails && (
  <div className="recommendation-details">

    <div className="detail-card">
      <span>🎯 FOCUS AREA</span>
      <h3>
        {skills.length > 0
          ? skills.reduce((weakest, skill) =>
              skill.score < weakest.score
                ? skill
                : weakest
            ).name
          : "Complete an assessment"}
      </h3>
      <p>
        This is currently your weakest assessed skill
        and should be your primary area of improvement.
      </p>
    </div>

    <div className="detail-card">
      <span>📚 WHAT TO LEARN</span>
      <p>
        {skills.length > 0 &&
        skills.reduce((weakest, skill) =>
          skill.score < weakest.score
            ? skill
            : weakest
        ).name === "Java"
          ? "OOP concepts, Collections, Exception Handling, Multithreading and Advanced Java."
          : skills.length > 0 &&
            skills.reduce((weakest, skill) =>
              skill.score < weakest.score
                ? skill
                : weakest
            ).name === "SQL"
          ? "Joins, Subqueries, Aggregation, Indexing, Query Optimization and Database Design."
          : skills.length > 0 &&
            skills.reduce((weakest, skill) =>
              skill.score < weakest.score
                ? skill
                : weakest
            ).name === "React"
          ? "Components, State Management, Hooks, API Integration and Modern React Patterns."
          : skills.length > 0 &&
            skills.reduce((weakest, skill) =>
              skill.score < weakest.score
                ? skill
                : weakest
            ).name === "Spring Boot"
          ? "REST APIs, CRUD Operations, MySQL Integration, Spring Security and Backend Deployment."
          : "Complete more assessments to receive a detailed learning recommendation."}
      </p>
    </div>

    <div className="detail-card">
      <span>🚀 NEXT ACTION</span>
      <p>
        Take another skill assessment and follow the
        recommended learning roadmap to improve your
        career readiness.
      </p>
    </div>

  </div>
)}
            </div>

            

          </section>
          <section className="profile-card">

<p className="section-label">
🤖 AI PROGRESS ANALYSIS
</p>


<h2>
Developer Growth Analysis
</h2>


{
analysis && (

<div className="analysis-list">


<p>
Completed Modules:
{" "}
{analysis.completedSteps}
/
{analysis.totalSteps}
</p>


<p>
Progress:
{" "}
{analysis.progress}
</p>


<p>
Current Level:
{" "}
{analysis.level}
</p>


<p>
Strong Area:
{" "}
{analysis.strength}
</p>


<p>
Next Recommendation:
{" "}
{analysis.nextRecommendation}
</p>


</div>

)

}


</section>
          <section className="profile-card">

  <p className="section-label">
    LEARNING JOURNEY
  </p>

  <h2>
    Skill Improvement History
  </h2>



  

{
  history.length > 0 ? (

    history.map((item) => (

      <div
        className="journey-item"
        key={item.id}
      >

        <strong>
          {item.stepName}
        </strong>

        <p>
          Status: {item.status}
        </p>

        <span>
          ✅ Completed
        </span>

      </div>

    ))

  ) : (

    <p>
      No learning history available yet.
    </p>

  )
}


</section>
<section className="profile-card">

  <p className="section-label">
    PROGRESS ANALYTICS
  </p>

  <h2>
    Assessment Progress
  </h2>

  <div className="dashboard-stats">

    <div className="stat-card">
      <span>Assessments Taken</span>

      <strong>
        {assessmentHistory.length}
      </strong>

      <small>
        Total attempts
      </small>
    </div>

    <div className="stat-card">
      <span>Average Score</span>

      <strong>
        {calculateAssessmentAverage()}%
      </strong>

      <small>
        Across all assessments
      </small>
    </div>
<div className="stat-card">
  <span>Progress Trend</span>

  <strong>
    {getProgressTrend()}
  </strong>

  <small>
    Based on recent attempts
  </small>
</div>
<div className="stat-card">
  <span>Best Score</span>

  <strong>
    {getBestScore()}%
  </strong>

  <small>
    Highest assessment score
  </small>
</div>


<div className="stat-card">
  <span>Strongest Skill</span>

  <strong>
    {getStrongestSkill()}
  </strong>

  <small>
    Highest skill performance
  </small>
</div>


<div className="stat-card">
  <span>Focus Skill</span>

  <strong>
    {getFocusSkill()}
  </strong>

  <small>
    Skill needing more practice
  </small>
</div>
  </div>

  <h3 style={{ marginTop: "30px" }}>
    Skill-wise Progress
  </h3>

  <div className="dashboard-stats">

   
<div className="stat-card">

  <span>Java</span>

  <strong>
    {getSkillAverage("Java")}%
  </strong>

  <div
    style={{
      width: "100%",
      height: "8px",
      background: "#1e293b",
      borderRadius: "10px",
      marginTop: "12px",
      overflow: "hidden"
    }}
  >
    <div
      style={{
        width: `${getSkillAverage("Java")}%`,
        height: "100%",
        background: "#22d3ee",
        borderRadius: "10px"
      }}
    ></div>
  </div>

  <small>
    Assessment performance
  </small>

</div>
    <div className="stat-card">

  <span>SQL</span>

  <strong>
    {getSkillAverage("SQL")}%
  </strong>

  <div
    style={{
      width: "100%",
      height: "8px",
      background: "#1e293b",
      borderRadius: "10px",
      marginTop: "12px",
      overflow: "hidden"
    }}
  >
    <div
      style={{
        width: `${getSkillAverage("SQL")}%`,
        height: "100%",
        background: "#22d3ee",
        borderRadius: "10px"
      }}
    ></div>
  </div>

  <small>
    Assessment performance
  </small>

</div>

    <div className="stat-card">

  <span>React</span>

  <strong>
    {getSkillAverage("React")}%
  </strong>

  <div
    style={{
      width: "100%",
      height: "8px",
      background: "#1e293b",
      borderRadius: "10px",
      marginTop: "12px",
      overflow: "hidden"
    }}
  >
    <div
      style={{
        width: `${getSkillAverage("React")}%`,
        height: "100%",
        background: "#22d3ee",
        borderRadius: "10px"
      }}
    ></div>
  </div>

  <small>
    Assessment performance
  </small>

</div>

    <div className="stat-card">

  <span>Spring Boot</span>

  <strong>
    {getSkillAverage("Spring Boot")}%
  </strong>

  <div
    style={{
      width: "100%",
      height: "8px",
      background: "#1e293b",
      borderRadius: "10px",
      marginTop: "12px",
      overflow: "hidden"
    }}
  >
    <div
      style={{
        width: `${getSkillAverage("Spring Boot")}%`,
        height: "100%",
        background: "#22d3ee",
        borderRadius: "10px"
      }}
    ></div>
  </div>

  <small>
    Assessment performance
  </small>

</div>

  </div>

</section>

<h3 style={{ marginTop: "30px" }}>
  Achievements & Milestones
</h3>

<div className="dashboard-stats">

  {getAchievements().map((achievement, index) => (

  <div className="achievement-card" key={index}>

    <span>
      {achievement.unlocked ? "🏆 Achievement" : "🔒 Locked"}
    </span>

    <strong>
      {achievement.name}
    </strong>

    <small>
      {achievement.message}
    </small>

  </div>

))}

</div>
<section className="profile-card">

  <p className="section-label">
    ASSESSMENT HISTORY
  </p>

  <h2>
    Assessment Attempt History
  </h2>

  {assessmentHistory.length > 0 ? (

    assessmentHistory.map((item) => (

      <div
        className="journey-item"
        key={item.id}
      >

        <strong>
          {item.skill} Assessment
        </strong>

        <p>
          Score: {item.score}%
        </p>

        <p>
          Correct Answers: {item.correctAnswers} / {item.totalQuestions}
        </p>

       <small>
  Attempted: {new Date(item.attemptedAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}
</small>

      </div>

    ))

  ) : (

    <p>
      No assessment attempts available yet.
    </p>

  )}

</section>
          {showRoadmap && (
  <section className="profile-card">

    <p className="section-label">
      YOUR LEARNING ROADMAP
    </p>

   <h2>
  {skills.length > 0
    ? `${skills.reduce((weakest, skill) =>
        skill.score < weakest.score ? skill : weakest
      ).name} Improvement Roadmap`
    : "Learning Roadmap"}
</h2>
    <div className="roadmap-progress">
  <strong>Roadmap Progress: {roadmapProgress}%</strong>

  <div className="progress">
    <div
      className="progress-fill java"
      style={{
        width: roadmapProgress + '%'
      }}
    >
    </div>
  </div>

  <small>
    {completedSteps.length} of 5 steps completed
  </small>
  {roadmapLoading && <small>Loading saved progress...</small>}
  {roadmapSaving && <small>Saving progress...</small>}
  {roadmapError && <small className="register-error">{roadmapError}</small>}
  {
  completedSteps.length === 5 && (
    <p className="completion-message">
      🎉 Congratulations! You have completed your {getWeakestSkill()?.name || "learning"} roadmap.
    </p>
  )
}
</div>

<div className="recommendation-details">

  <div className="detail-card">
    <span>🎯 WHY THIS?</span>
    <p>
      {getWeakestSkill()?.name || "Your weakest skill"} is currently
      your weakest assessed skill, so improving it can significantly
      increase your career readiness.
    </p>
  </div>

  <div className="detail-card">
    <span>📚 WHAT TO LEARN</span>

    <p>
      {getWeakestSkill()?.name === "SQL"
        ? "SQL fundamentals, joins, subqueries, aggregation, indexing, query optimization and database design."
        : getWeakestSkill()?.name === "Java"
        ? "OOP concepts, Collections, Exception Handling, Multithreading and Advanced Java."
        : getWeakestSkill()?.name === "React"
        ? "Components, State Management, Hooks, API Integration and Modern React Patterns."
        : getWeakestSkill()?.name === "Spring Boot"
        ? "REST APIs, CRUD Operations, MySQL Integration, Spring Security and Backend Deployment."
        : "Complete more assessments to receive a detailed learning recommendation."}
    </p>
  </div>

  <div className="detail-card">
    <span>⏱️ ESTIMATED TIME</span>

    <p>
      3–4 weeks with consistent daily practice.
    </p>
  </div>

</div>
<p>
  Follow these steps to strengthen your {getWeakestSkill()?.name || "development"} skills.
</p>
    
    <div className="roadmap-list">
      {getWeakestSkill()?.name === "Java" && (
  <>
    <div
      className={`roadmap-item ${
        completedSteps.includes(1) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(1)}
    >
      <strong>
        {completedSteps.includes(1) ? "✓ " : "01 — "}
        OOP Concepts
      </strong>

      <span>
        Master classes, objects, inheritance, polymorphism and encapsulation.
      </span>

      <small>
        {completedSteps.includes(1)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(1) && (
        <div className="step-details">
          <p>Difficulty: Beginner</p>
          <p>Duration: 3 Days</p>

          <p>
            Topics:
            <br />
            ✓ Classes & Objects
            <br />
            ✓ Encapsulation
            <br />
            ✓ Inheritance
            <br />
            ✓ Polymorphism
            <br />
            ✓ Abstraction
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(2) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(2)}
    >
      <strong>
        {completedSteps.includes(2) ? "✓ " : "02 — "}
        Java Collections
      </strong>

      <span>
        Learn how to efficiently store and manipulate groups of objects.
      </span>

      <small>
        {completedSteps.includes(2)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(2) && (
        <div className="step-details">
          <p>Difficulty: Intermediate</p>
          <p>Duration: 4 Days</p>

          <p>
            Topics:
            <br />
            ✓ ArrayList
            <br />
            ✓ LinkedList
            <br />
            ✓ HashSet
            <br />
            ✓ HashMap
            <br />
            ✓ PriorityQueue
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(3) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(3)}
    >
      <strong>
        {completedSteps.includes(3) ? "✓ " : "03 — "}
        Exception Handling
      </strong>

      <span>
        Learn how to handle runtime errors and build reliable Java programs.
      </span>

      <small>
        {completedSteps.includes(3)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(3) && (
        <div className="step-details">
          <p>Difficulty: Intermediate</p>
          <p>Duration: 3 Days</p>

          <p>
            Topics:
            <br />
            ✓ try-catch
            <br />
            ✓ finally
            <br />
            ✓ throw
            <br />
            ✓ throws
            <br />
            ✓ Custom Exceptions
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(4) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(4)}
    >
      <strong>
        {completedSteps.includes(4) ? "✓ " : "04 — "}
        Multithreading
      </strong>

      <span>
        Learn how Java handles multiple tasks running concurrently.
      </span>

      <small>
        {completedSteps.includes(4)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(4) && (
        <div className="step-details">
          <p>Difficulty: Advanced</p>
          <p>Duration: 5 Days</p>

          <p>
            Topics:
            <br />
            ✓ Threads
            <br />
            ✓ Runnable
            <br />
            ✓ Thread Lifecycle
            <br />
            ✓ Synchronization
            <br />
            ✓ Concurrency
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(5) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(5)}
    >
      <strong>
        {completedSteps.includes(5) ? "✓ " : "05 — "}
        Advanced Java
      </strong>

      <span>
        Strengthen advanced Java programming and prepare for backend development.
      </span>

      <small>
        {completedSteps.includes(5)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(5) && (
        <div className="step-details">
          <p>Difficulty: Advanced</p>
          <p>Duration: 5 Days</p>

          <p>
            Topics:
            <br />
            ✓ Streams
            <br />
            ✓ Lambda Expressions
            <br />
            ✓ Functional Interfaces
            <br />
            ✓ Generics
            <br />
            ✓ Java Backend Concepts
          </p>
        </div>
      )}
    </div>
  </>
)}
{getWeakestSkill()?.name === "React" && (
  <>
    <div
      className={`roadmap-item ${
        completedSteps.includes(1) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(1)}
    >
      <strong>
        {completedSteps.includes(1) ? "✓ " : "01 — "}
        React Components
      </strong>

      <span>
        Learn components, props, JSX and component structure.
      </span>

      <small>
        {completedSteps.includes(1)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(1) && (
        <div className="step-details">
          <p>Difficulty: Beginner</p>
          <p>Duration: 3 Days</p>

          <p>
            Topics:
            <br />
            ✓ Functional Components
            <br />
            ✓ JSX
            <br />
            ✓ Props
            <br />
            ✓ Component Structure
            <br />
            ✓ Reusable Components
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(2) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(2)}
    >
      <strong>
        {completedSteps.includes(2) ? "✓ " : "02 — "}
        State Management & Hooks
      </strong>

      <span>
        Learn useState, useEffect and modern React state management.
      </span>

      <small>
        {completedSteps.includes(2)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(2) && (
        <div className="step-details">
          <p>Difficulty: Intermediate</p>
          <p>Duration: 4 Days</p>

          <p>
            Topics:
            <br />
            ✓ useState
            <br />
            ✓ useEffect
            <br />
            ✓ Event Handling
            <br />
            ✓ Conditional Rendering
            <br />
            ✓ State Management
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(3) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(3)}
    >
      <strong>
        {completedSteps.includes(3) ? "✓ " : "03 — "}
        API Integration
      </strong>

      <span>
        Learn how React applications communicate with backend APIs.
      </span>

      <small>
        {completedSteps.includes(3)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(3) && (
        <div className="step-details">
          <p>Difficulty: Intermediate</p>
          <p>Duration: 4 Days</p>

          <p>
            Topics:
            <br />
            ✓ Fetch API
            <br />
            ✓ GET Requests
            <br />
            ✓ POST Requests
            <br />
            ✓ JSON Data
            <br />
            ✓ Backend Integration
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(4) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(4)}
    >
      <strong>
        {completedSteps.includes(4) ? "✓ " : "04 — "}
        React Routing
      </strong>

      <span>
        Learn navigation and multi-page application structure.
      </span>

      <small>
        {completedSteps.includes(4)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(4) && (
        <div className="step-details">
          <p>Difficulty: Intermediate</p>
          <p>Duration: 3 Days</p>

          <p>
            Topics:
            <br />
            ✓ React Router
            <br />
            ✓ Routes
            <br />
            ✓ Navigation
            <br />
            ✓ Dynamic Routes
            <br />
            ✓ Protected Routes
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(5) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(5)}
    >
      <strong>
        {completedSteps.includes(5) ? "✓ " : "05 — "}
        Modern React Patterns
      </strong>

      <span>
        Learn advanced patterns used in production React applications.
      </span>

      <small>
        {completedSteps.includes(5)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(5) && (
        <div className="step-details">
          <p>Difficulty: Advanced</p>
          <p>Duration: 5 Days</p>

          <p>
            Topics:
            <br />
            ✓ Custom Hooks
            <br />
            ✓ Context API
            <br />
            ✓ Component Composition
            <br />
            ✓ Performance Optimization
            <br />
            ✓ Clean React Architecture
          </p>
        </div>
      )}
    </div>
  </>
)}
{getWeakestSkill()?.name === "Spring Boot" && (
  <>
    <div
      className={`roadmap-item ${
        completedSteps.includes(1) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(1)}
    >
      <strong>
        {completedSteps.includes(1) ? "✓ " : "01 — "}
        REST Controllers
      </strong>

      <span>
        Learn how to create REST APIs using Spring Boot controllers.
      </span>

      <small>
        {completedSteps.includes(1)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(1) && (
        <div className="step-details">
          <p>Difficulty: Beginner</p>
          <p>Duration: 3 Days</p>

          <p>
            Topics:
            <br />
            ✓ @RestController
            <br />
            ✓ @GetMapping
            <br />
            ✓ @PostMapping
            <br />
            ✓ @PutMapping
            <br />
            ✓ @DeleteMapping
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(2) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(2)}
    >
      <strong>
        {completedSteps.includes(2) ? "✓ " : "02 — "}
        CRUD APIs
      </strong>

      <span>
        Build Create, Read, Update and Delete operations using Spring Boot.
      </span>

      <small>
        {completedSteps.includes(2)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(2) && (
        <div className="step-details">
          <p>Difficulty: Intermediate</p>
          <p>Duration: 4 Days</p>

          <p>
            Topics:
            <br />
            ✓ Create
            <br />
            ✓ Read
            <br />
            ✓ Update
            <br />
            ✓ Delete
            <br />
            ✓ REST API Design
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(3) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(3)}
    >
      <strong>
        {completedSteps.includes(3) ? "✓ " : "03 — "}
        MySQL Database
      </strong>

      <span>
        Learn how to connect Spring Boot applications with MySQL databases.
      </span>

      <small>
        {completedSteps.includes(3)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(3) && (
        <div className="step-details">
          <p>Difficulty: Intermediate</p>
          <p>Duration: 4 Days</p>

          <p>
            Topics:
            <br />
            ✓ MySQL
            <br />
            ✓ JPA
            <br />
            ✓ Hibernate
            <br />
            ✓ Entities
            <br />
            ✓ Repositories
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(4) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(4)}
    >
      <strong>
        {completedSteps.includes(4) ? "✓ " : "04 — "}
        Spring Boot Security
      </strong>

      <span>
        Learn authentication and authorization for backend applications.
      </span>

      <small>
        {completedSteps.includes(4)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(4) && (
        <div className="step-details">
          <p>Difficulty: Advanced</p>
          <p>Duration: 5 Days</p>

          <p>
            Topics:
            <br />
            ✓ Spring Security
            <br />
            ✓ Authentication
            <br />
            ✓ Authorization
            <br />
            ✓ Password Security
            <br />
            ✓ Role-Based Access
          </p>
        </div>
      )}
    </div>

    <div
      className={`roadmap-item ${
        completedSteps.includes(5) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(5)}
    >
      <strong>
        {completedSteps.includes(5) ? "✓ " : "05 — "}
        Backend Deployment
      </strong>

      <span>
        Learn how to prepare and deploy a Spring Boot backend application.
      </span>

      <small>
        {completedSteps.includes(5)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(5) && (
        <div className="step-details">
          <p>Difficulty: Advanced</p>
          <p>Duration: 5 Days</p>

          <p>
            Topics:
            <br />
            ✓ Application Configuration
            <br />
            ✓ Environment Variables
            <br />
            ✓ Build JAR
            <br />
            ✓ Backend Deployment
            <br />
            ✓ Production Configuration
          </p>
        </div>
      )}
    </div>
  </>
)}

{getWeakestSkill()?.name === "SQL" && (
  <>
    <div
      className={`roadmap-item ${
        completedSteps.includes(1) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(1)}
    >
      <strong>
        {completedSteps.includes(1) ? "✓ " : "01 — "}
        SQL Fundamentals
      </strong>

      <span>
        Learn SELECT queries, filtering, sorting and aggregation.
      </span>

      <small>
        {completedSteps.includes(1)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(1) && (
        <div className="step-details">
          <p>Difficulty: Beginner</p>
          <p>Duration: 3 Days</p>

          <p>
            Topics:
            <br />
            ✓ SELECT
            <br />
            ✓ WHERE
            <br />
            ✓ ORDER BY
            <br />
            ✓ GROUP BY
            <br />
            ✓ Aggregate Functions
          </p>
        </div>
      )}
    </div>


    <div
      className={`roadmap-item ${
        completedSteps.includes(2) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(2)}
    >
      <strong>
        {completedSteps.includes(2) ? "✓ " : "02 — "}
        SQL Joins
      </strong>

      <span>
        Learn how to combine data from multiple database tables.
      </span>

      <small>
        {completedSteps.includes(2)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(2) && (
        <div className="step-details">
          <p>Difficulty: Intermediate</p>
          <p>Duration: 4 Days</p>

          <p>
            Topics:
            <br />
            ✓ INNER JOIN
            <br />
            ✓ LEFT JOIN
            <br />
            ✓ RIGHT JOIN
            <br />
            ✓ FULL JOIN
            <br />
            ✓ SELF JOIN
          </p>
        </div>
      )}
    </div>


    <div
      className={`roadmap-item ${
        completedSteps.includes(3) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(3)}
    >
      <strong>
        {completedSteps.includes(3) ? "✓ " : "03 — "}
        Subqueries & Aggregation
      </strong>

      <span>
        Master advanced SQL queries and data analysis.
      </span>

      <small>
        {completedSteps.includes(3)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(3) && (
        <div className="step-details">
          <p>Difficulty: Intermediate</p>
          <p>Duration: 4 Days</p>

          <p>
            Topics:
            <br />
            ✓ Subqueries
            <br />
            ✓ Nested Queries
            <br />
            ✓ COUNT
            <br />
            ✓ SUM
            <br />
            ✓ AVG
            <br />
            ✓ HAVING
          </p>
        </div>
      )}
    </div>


    <div
      className={`roadmap-item ${
        completedSteps.includes(4) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(4)}
    >
      <strong>
        {completedSteps.includes(4) ? "✓ " : "04 — "}
        Indexing & Query Optimization
      </strong>

      <span>
        Learn how to make database queries faster and more efficient.
      </span>

      <small>
        {completedSteps.includes(4)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(4) && (
        <div className="step-details">
          <p>Difficulty: Advanced</p>
          <p>Duration: 5 Days</p>

          <p>
            Topics:
            <br />
            ✓ Indexes
            <br />
            ✓ Query Execution
            <br />
            ✓ EXPLAIN
            <br />
            ✓ Query Optimization
            <br />
            ✓ Performance Tuning
          </p>
        </div>
      )}
    </div>


    <div
      className={`roadmap-item ${
        completedSteps.includes(5) ? "completed-step" : ""
      }`}
      onClick={() => toggleRoadmapStep(5)}
    >
      <strong>
        {completedSteps.includes(5) ? "✓ " : "05 — "}
        Database Design
      </strong>

      <span>
        Learn how to design efficient relational databases.
      </span>

      <small>
        {completedSteps.includes(5)
          ? "Completed"
          : "Click to mark as completed"}
      </small>

      {completedSteps.includes(5) && (
        <div className="step-details">
          <p>Difficulty: Advanced</p>
          <p>Duration: 5 Days</p>

          <p>
            Topics:
            <br />
            ✓ Normalization
            <br />
            ✓ Primary Keys
            <br />
            ✓ Foreign Keys
            <br />
            ✓ Relationships
            <br />
            ✓ Database Schema Design
          </p>
        </div>
      )}
    </div>
  </>
)}
</div>
    <button
      className="back-button"
      onClick={() => setShowRoadmap(false)}
    >
      ← Close Roadmap
    </button>

  </section>
)}
        </main>

      </div>
    )
  }

  return (
    <div className="app">

      <nav className="navbar">

        <div className="logo">
          DevFusion
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </div>

      </nav>

      <main>

        {!started ? (

          <>

            <section
              className="hero"
              id="home"
            >

              <div className="hero-content">

                <p className="tagline">
                  YOUR DEVELOPER GROWTH PLATFORM
                </p>

                <h1>
                  Understand Your Skills.
                  <br />
                  <span>Build Your Future.</span>
                </h1>

                <p className="hero-text">
                  DevFusion helps you understand your technical
                  skills, track your progress, identify weaknesses,
                  and discover what you should learn next.
                </p>

                <button
                  className="hero-button"
                  onClick={() => setStarted(true)}
                >
                  Get Started
                </button>

              </div>

              <div className="hero-card">

                <div className="card-header">
                  <span>Skill Profile</span>
                  <span>72%</span>
                </div>

                <div className="skill">

                  <div>
                    <span>Java</span>
                    <span>85%</span>
                  </div>

                  <div className="progress">
                    <div className="progress-fill java"></div>
                  </div>

                </div>

                <div className="skill">

                  <div>
                    <span>SQL</span>
                    <span>75%</span>
                  </div>

                  <div className="progress">
                    <div className="progress-fill sql"></div>
                  </div>

                </div>

                <div className="skill">

                  <div>
                    <span>React</span>
                    <span>60%</span>
                  </div>

                  <div className="progress">
                    <div className="progress-fill react"></div>
                  </div>

                </div>

                <div className="skill">

                  <div>
                    <span>Spring Boot</span>
                    <span>40%</span>
                  </div>

                  <div className="progress">
                    <div className="progress-fill spring"></div>
                  </div>

                </div>

                <div className="recommendation">

                  <small>
                    Next Recommendation
                  </small>

                  <strong>
                    Learn Spring Boot REST APIs →
                  </strong>

                </div>

              </div>

            </section>

            <section
              className="features"
              id="features"
            >

              <p className="section-label">
                WHY DEVFUSION?
              </p>

              <h2>
                Everything you need to grow as a developer.
              </h2>

              <div className="feature-grid">

                <div className="feature-card">

                  <div className="icon">🧠</div>

                  <h3>Skill Intelligence</h3>

                  <p>
                    Understand your strengths and identify
                    the technical skills that need improvement.
                  </p>

                </div>

                <div className="feature-card">

                  <div className="icon">📊</div>

                  <h3>Progress Tracking</h3>

                  <p>
                    Track how your technical skills improve
                    over time.
                  </p>

                </div>

                <div className="feature-card">

                  <div className="icon">🎯</div>

                  <h3>Career Readiness</h3>

                  <p>
                    See how prepared you are for your chosen
                    developer career.
                  </p>

                </div>

                <div className="feature-card">

                  <div className="icon">💡</div>

                  <h3>Smart Recommendations</h3>

                  <p>
                    Discover what you should focus on next
                    based on your current skills.
                  </p>

                </div>

              </div>

            </section>

            <section
              className="how-it-works"
              id="how-it-works"
            >

              <p className="section-label">
                HOW IT WORKS
              </p>

              <h2>
                Your growth. One clear path.
              </h2>

              <div className="steps">

                <div className="step">

                  <span>01</span>

                  <h3>Build Your Profile</h3>

                  <p>
                    Add your technical skills and career goal.
                  </p>

                </div>

                <div className="step">

                  <span>02</span>

                  <h3>Analyze Your Skills</h3>

                  <p>
                    DevFusion identifies your strengths and
                    weaknesses.
                  </p>

                </div>

                <div className="step">

                  <span>03</span>

                  <h3>Follow Your Roadmap</h3>

                  <p>
                    Get recommendations for your next
                    learning goal.
                  </p>

                </div>

              </div>

            </section>

          </>

        ) : (

          <section className="register-section">

            <div className="register-card">

              {!accountCreated ? (

                <>

                  <p className="section-label">
                    WELCOME TO DEVFUSION
                  </p>

                  <h2>
                    Create Your Profile
                  </h2>

                  <p className="register-text">
                    Tell us a little about yourself so DevFusion
                    can build your personalized developer journey.
                  </p>

                  <form onSubmit={handleCreateAccount}>

                    <div className="form-group">

                      <label>
                        Full Name
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Email
                      </label>

                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Password
                      </label>

                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        placeholder="Create a password"
                        required
                      />

                    </div>

                    <div className="form-group">

                      <label>
                        Career Goal
                      </label>

                      <select
                        name="careerGoal"
                        value={formData.careerGoal}
                        onChange={handleInputChange}
                        required
                      >

                        <option
                          value=""
                          disabled
                        >
                          Select your career goal
                        </option>

                        <option value="Backend Developer">
                          Backend Developer
                        </option>

                        <option value="Frontend Developer">
                          Frontend Developer
                        </option>

                        <option value="Full Stack Developer">
                          Full Stack Developer
                        </option>

                        <option value="Data Engineer">
                          Data Engineer
                        </option>

                        <option value="AI Engineer">
                          AI Engineer
                        </option>

                      </select>

                    </div>

                    {registerError && (
                      <p className="register-error">
                        {registerError}
                      </p>
                    )}

                    <button
                      className="hero-button"
                      type="submit"
                      disabled={registerLoading}
                    >
                      {registerLoading
                        ? 'Creating Account...'
                        : 'Create Account'}
                    </button>

                  </form>

                  <button
                    className="back-button"
                    onClick={() => setStarted(false)}
                  >
                    ← Back to Home
                  </button>

                </>

              ) : (

                <div className="success-message">

                  <div className="success-icon">
                    ✓
                  </div>

                  <p className="section-label">
                    SUCCESS
                  </p>

                  <h2>
                    Account Created!
                  </h2>

                  <p className="register-text">
                    Your DevFusion profile has been saved
                    successfully.
                  </p>

                  <button
                    className="hero-button"
                    onClick={handleContinue}
                  >
                    Continue to Dashboard
                  </button>

                </div>

              )}

            </div>

          </section>

        )}

      </main>

    </div>
  )
}

export default App
