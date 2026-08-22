import { useState } from 'react'
import './App.css'

function App() {
  const [started, setStarted] = useState(false)
  const [accountCreated, setAccountCreated] = useState(false)
  const [dashboard, setDashboard] = useState(false)
  const [skills, setSkills] = useState([])
 const [history, setHistory] = useState([])
const [analysis, setAnalysis] = useState(null)
const [userId, setUserId] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [recommendation, setRecommendation] = useState('')
  const [showRoadmap, setShowRoadmap] = useState(false)
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
      const response = await fetch('http://localhost:8080/api/skills')

      if (!response.ok) {
        throw new Error('Failed to load skills')
      }

      const data = await response.json()

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

async function loadRecommendation(careerGoal) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/recommendation/${encodeURIComponent(careerGoal)}`
    )

    if (!response.ok) {
      throw new Error('Failed to load recommendation')
    }
const data = await response.text()

console.log("Recommendation from backend:", data)

setRecommendation(data)
    
  } catch (error) {
    console.error('Error loading recommendation:', error)
    setRecommendation('No recommendation available')
  }
}

  async function loadRoadmapProgress(id) {
  try {
    const response = await fetch(
      `http://localhost:8080/api/roadmap/${id}`
    )

    if (!response.ok) {
      throw new Error('Failed to load roadmap progress')
    }

    const data = await response.json()

    if (data.completedSteps) {
      const steps = data.completedSteps
        .split(',')
        .filter((step) => step !== '')
        .map(Number)

      setCompletedSteps(steps)
      await loadHistory(id);
    }

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
      const response = await fetch(`http://localhost:8080/api/roadmap/${userId}`, {
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
      
await loadHistory(userId);
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
      const response = await fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.status === 409) {
        setRegisterError('This email is already registered.')
        setRegisterLoading(false)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to create account')
      }

     const savedUser = await response.json()

setUserId(savedUser.id)

setAccountCreated(true)
    } catch (error) {
      console.error('Registration error:', error)
      setRegisterError(
        'Unable to create account. Please make sure the backend is running.'
      )
    } finally {
      setRegisterLoading(false)
    }
  }


async function handleContinue() {

    await loadSkills()


    const response = await fetch(
      `http://localhost:8080/api/users/${userId}`
    )


    const data = await response.json()


    setUserProfile(data)


   await loadRecommendation(data.careerGoal)

   await loadRoadmapProgress(userId)
   await loadHistory(userId)

    setDashboard(true)
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
              <span>Overall Skill Score</span>

              <strong>{calculateAverage()}%</strong>

              <small>
                {skills.length > 0
                  ? 'Based on your technical skills'
                  : 'No skills available'}
              </small>
            </div>

            <div className="stat-card">
              <span>Career Readiness</span>

             <strong>{calculateCareerReadiness()}%</strong>

              <small>
                {getReadinessStatus()}
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

            <div className="dashboard-skills">

              {skills.map((skill) => (

                <div
                  className="dashboard-skill"
                  key={skill.id}
                >

                  <div>
  <span>{skill.name}</span>

  <strong>{skill.score}%</strong>

  <small>
    {getSkillStatus(skill.score)}
  </small>
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
  onClick={async () => {
    await loadRoadmapProgress(userId)
    setShowRoadmap(true)
  }}
>
  View Recommendation
</button>
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
          {showRoadmap && (
  <section className="profile-card">

    <p className="section-label">
      YOUR LEARNING ROADMAP
    </p>

    <h2>
      Spring Boot & Backend Roadmap
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
      🎉 Congratulations! You have completed your backend learning roadmap.
    </p>
  )
}
</div>

    <div className="recommendation-details">

      <div className="detail-card">
        <span>🎯 WHY THIS?</span>
        <p>
          Spring Boot is currently your weakest backend skill,
          so improving it can significantly increase your
          backend development readiness.
        </p>
      </div>

      <div className="detail-card">
        <span>📚 WHAT TO LEARN</span>
        <p>
          REST APIs, CRUD operations, MySQL integration,
          Spring Security, and backend deployment.
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
      Follow these steps to strengthen your backend development skills.
    </p>

    <div className="roadmap-list">

<div
className={`roadmap-item ${completedSteps.includes(1) ? "completed-step" : ""}`}
onClick={() => toggleRoadmapStep(1)}
>

<strong>
{completedSteps.includes(1) ? '✓ ' : '01 — '}
REST Controllers
</strong>

<span>
Learn how to create REST APIs using Spring Boot.
</span>

<small>
{completedSteps.includes(1)
? 'Completed'
: 'Click to mark as completed'}
</small>

{
completedSteps.includes(1) && (
<div className="step-details">

<p>
Difficulty: Beginner
</p>

<p>
Duration: 3 Days
</p>

<p>
Topics:
<br/>
✓ @RestController
<br/>
✓ GET API
<br/>
✓ POST API
<br/>
✓ Request & Response Handling
</p>

</div>
)
}

</div>



<div
className={`roadmap-item ${completedSteps.includes(2) ? "completed-step" : ""}`}
onClick={() => toggleRoadmapStep(2)}
>

<strong>
{completedSteps.includes(2) ? '✓ ' : '02 — '}
CRUD APIs
</strong>

<span>
Build Create, Read, Update and Delete operations.
</span>

<small>
{completedSteps.includes(2)
? 'Completed'
: 'Click to mark as completed'}
</small>


{
completedSteps.includes(2) && (
<div className="step-details">

<p>
Difficulty: Intermediate
</p>

<p>
Duration: 5 Days
</p>

<p>
Topics:
<br/>
✓ Create API
<br/>
✓ Read API
<br/>
✓ Update API
<br/>
✓ Delete API
</p>

</div>
)
}

</div>




<div
className={`roadmap-item ${completedSteps.includes(3) ? "completed-step" : ""}`}
onClick={() => toggleRoadmapStep(3)}
>

<strong>
{completedSteps.includes(3) ? '✓ ' : '03 — '}
MySQL Database
</strong>

<span>
Connect your Spring Boot application with MySQL.
</span>

<small>
{completedSteps.includes(3)
? 'Completed'
: 'Click to mark as completed'}
</small>


{
completedSteps.includes(3) && (
<div className="step-details">

<p>
Difficulty: Intermediate
</p>

<p>
Duration: 4 Days
</p>

<p>
Topics:
<br/>
✓ Database Connection
<br/>
✓ JPA & Hibernate
<br/>
✓ Entity Mapping
<br/>
✓ Repository Layer
</p>

</div>
)
}

</div>




<div
className={`roadmap-item ${completedSteps.includes(4) ? "completed-step" : ""}`}
onClick={() => toggleRoadmapStep(4)}
>

<strong>
{completedSteps.includes(4) ? '✓ ' : '04 — '}
Spring Boot Security
</strong>

<span>
Learn authentication and secure your APIs.
</span>

<small>
{completedSteps.includes(4)
? 'Completed'
: 'Click to mark as completed'}
</small>


{
completedSteps.includes(4) && (
<div className="step-details">

<p>
Difficulty: Advanced
</p>

<p>
Duration: 7 Days
</p>

<p>
Topics:
<br/>
✓ Authentication
<br/>
✓ Authorization
<br/>
✓ JWT Security
<br/>
✓ Protecting REST APIs
</p>

</div>
)
}

</div>




<div
className={`roadmap-item ${completedSteps.includes(5) ? "completed-step" : ""}`}
onClick={() => toggleRoadmapStep(5)}
>

<strong>
{completedSteps.includes(5) ? '✓ ' : '05 — '}
Backend Deployment
</strong>

<span>
Deploy your backend application for real-world use.
</span>

<small>
{completedSteps.includes(5)
? 'Completed'
: 'Click to mark as completed'}
</small>


{
completedSteps.includes(5) && (
<div className="step-details">

<p>
Difficulty: Advanced
</p>

<p>
Duration: 5 Days
</p>

<p>
Topics:
<br/>
✓ Cloud Deployment
<br/>
✓ Environment Variables
<br/>
✓ Production Setup
</p>

</div>
)
}

</div>


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
