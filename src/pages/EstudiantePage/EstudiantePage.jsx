import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../../context/AppContext";
import { useAuth } from '../../contexts/AuthContext';
import CoursesList from "../../components/CoursesList/CoursesList";
import EncuestaForm from "../../components/EvaluationForm/EvaluationForm";
import PeriodSelector from "../../components/PeriodSelector";
import './estudiantePage.css';

/**
 * StudentPage Component
 * 
 * This component handles the student interface for course evaluations.
 * It allows students to:
 * - Select academic periods
 * - View their courses
 * - Evaluate teachers
 * - Submit evaluation forms
 */
function EstudiantePage() {
  const navigate = useNavigate();
  const { currentUser, userRoles } = useAuth();
  const { 
    students, 
    courses, 
    teachers, 
    studentCourses, 
    periods,
    currentPeriod,
    setCurrentPeriod,
    isEncuestaActivaForPeriod,
    responses
  } = useContext(AppContext);
  
  // State for selected evaluation data
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEvaluationForm, setShowEvaluationForm] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(currentPeriod);
  const [availablePeriods, setAvailablePeriods] = useState([]);
  const [error, setError] = useState(null);
  
  /**
   * Effect to handle user authentication and data initialization
   * - Checks user authentication
   * - Verifies student role
   * - Sets up available periods
   * - Initializes student data
   */
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // Verify student role
    if (!userRoles?.includes('estudiante')) {
      setError('You do not have permission to access this page');
      return;
    }

    // Find student data
    const student = students.find(s => s.email === currentUser.email);
    if (!student) {
      // Set all periods as available for temporary student
      setAvailablePeriods(periods);
      
      // Select first available period
      if (periods.length > 0) {
        setSelectedPeriod(periods[0].id);
        setCurrentPeriod(periods[0].id);
      }
    } else {
      // Get available periods for registered student
      const studentPeriodsIds = [...new Set(
        studentCourses
          .filter(sc => sc.studentId === student.id)
          .map(sc => sc.period)
      )];
      
      const filteredPeriods = periods.filter(period => 
        studentPeriodsIds.includes(period.id)
      );
      
      setAvailablePeriods(filteredPeriods);
      
      // Select first available period if current is not available
      if (filteredPeriods.length > 0) {
        const isCurrentPeriodAvailable = filteredPeriods.some(p => p.id === currentPeriod);
        if (!isCurrentPeriodAvailable) {
          setSelectedPeriod(filteredPeriods[0].id);
          setCurrentPeriod(filteredPeriods[0].id);
        }
      }
    }
  }, [currentUser, userRoles, students, studentCourses, periods, currentPeriod, navigate]);
  
  /**
   * Get student's courses for the selected period
   * @returns {Array} List of courses with evaluation status
   */
  const getStudentCourses = () => {
    const student = students.find(s => s.email === currentUser.email);
    if (!student) {
      // Return example courses for temporary student
      return courses.map(course => ({
        courseId: course.id,
        teacherId: teachers[0]?.id,
        courseName: course.nombre,
        teacherName: teachers[0]?.nombre || 'Example Teacher',
        group: course.grupo,
        isEvaluated: false
      }));
    }

    // Get courses for registered student
    const studentCoursesData = studentCourses.filter(
      sc => sc.studentId === student.id && sc.period === selectedPeriod
    );
    
    return studentCoursesData.map(sc => {
      const course = courses.find(c => c.id === sc.courseId);
      const teacher = teachers.find(t => t.id === sc.teacherId);
      
      // Check if course has been evaluated
      const isEvaluated = responses.some(
        r => r.studentId === student.id && 
             r.teacherId === sc.teacherId && 
             r.courseId === sc.courseId &&
             r.periodId === selectedPeriod
      );
      
      return {
        courseId: sc.courseId,
        teacherId: sc.teacherId,
        courseName: course ? course.nombre : 'Unknown Course',
        teacherName: teacher ? teacher.nombre : 'Unknown Teacher',
        group: sc.group,
        isEvaluated: isEvaluated
      };
    });
  };
  
  /**
   * Handle teacher selection for evaluation
   * @param {string} teacherId - Selected teacher ID
   * @param {string} courseId - Selected course ID
   */
  const handleSelectTeacher = (teacherId, courseId) => {
    setSelectedTeacher(teacherId);
    setSelectedCourse(courseId);
    setShowEvaluationForm(true);
  };
  
  /**
   * Handle evaluation form submission
   * @param {Object} responseData - Form submission data
   */
  const handleSubmitForm = (responseData) => {
    if (responseData && responseData.success) {
      setShowEvaluationForm(false);
      setSelectedTeacher(null);
      setSelectedCourse(null);
      alert('Evaluation submitted successfully!');
    } else {
      alert('There was a problem submitting the evaluation. Please try again.');
    }
  };
  
  /**
   * Handle period change
   * @param {string} periodId - Selected period ID
   */
  const handlePeriodChange = (periodId) => {
    setSelectedPeriod(periodId);
    setCurrentPeriod(periodId);
    setSelectedTeacher(null);
    setSelectedCourse(null);
    setShowEvaluationForm(false);
  };
  
  // Check if evaluation is active for selected period
  const isEvaluationActive = selectedPeriod ? isEncuestaActivaForPeriod(selectedPeriod) : false;

  // Don't render if user is not authenticated
  if (!currentUser) {
    return null;
  }

  // Show error message if there's an error
  if (error) {
    return (
      <div className="student-container">
        <div className="error-message">
          <h2>Access Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate('/')}>Return to Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="student-container">
      <h1>Student Portal</h1>
      <div className="student-dashboard">
        <PeriodSelector 
          periods={availablePeriods}
          selectedPeriod={selectedPeriod}
          onSelectPeriod={handlePeriodChange}
          label="Select academic period:"
        />
        
        {!isEvaluationActive ? (
          <div className="message-container">
            <h2>Evaluation Not Available</h2>
            <p>The teacher evaluation survey is not active for period {selectedPeriod}.</p>
            <button onClick={() => navigate('/')}>Return to Home</button>
          </div>
        ) : showEvaluationForm ? (
          <div className="survey-container">
            <h2>Teacher Evaluation - Period {selectedPeriod}</h2>
            <EncuestaForm
              studentId={students.find(s => s.email === currentUser.email)?.id || currentUser.uid}
              teacherId={selectedTeacher}
              courseId={selectedCourse}
              periodId={selectedPeriod}
              onComplete={handleSubmitForm}
            />
            <button onClick={() => setShowEvaluationForm(false)}>Cancel</button>
          </div>
        ) : (
          <>
            <h2>Select a teacher to evaluate</h2>
            <CoursesList
              courses={getStudentCourses()}
              selectedTeacher={selectedTeacher}
              selectedCourse={selectedCourse}
              onSelectTeacher={handleSelectTeacher}
            />
            <button onClick={() => navigate('/')} className="back-button">
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default EstudiantePage;