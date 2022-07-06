import Header from '../Header/Header';
import client from '../../utils/client';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './style.css';

const CohortPage = () => {
  const params = useParams();
  const navigate = useNavigate()
  const [cohortName, setCohortName] = useState()
  const [studentsInCohort, setStudentsInCohort] = useState()
  const [availibleUsers, setAvailibleUsers] = useState()

  useEffect(() => {
    client
        .get(`/cohort/${params.id}?availableStudents=true`)
        .then((res) => {
          setCohortName(res.data.data.cohortName)
          setStudentsInCohort(res.data.data.users)
          setAvailibleUsers(res.data.data.availableStudents)
        })
        .catch((err) => console.error(err.response));
  }, [params]);

  const handleSubmitAddStudentToCohort = (e, userId) => {
    e.preventDefault();

    client.patch(`/user/${userId}`, { cohort_id: +params.id })
    .then((res) => {
      const targetStudent = availibleUsers.find((user) => user.user.id === userId)
      const updatedStudentsInCohort = [...studentsInCohort, targetStudent]
      setStudentsInCohort(updatedStudentsInCohort)

      const updatedAvailibleUsers = availibleUsers.filter((user) => user.user.id !== userId)
      setAvailibleUsers(updatedAvailibleUsers)
    })
    .catch((err) => console.error(err.response));
  };

  const handleClick = (e, userId) => {
    e.preventDefault();
    navigate(`../profile/${userId}`, { replace: true })
  }

  return (
      <>
        <Header companyName={`Cohort Manager 2.0`} />
        <div className='container'>

          <div className='border'>
            <h2>Cohort Name: {cohortName}</h2>
            {studentsInCohort?.map((user, index) => (
              <div className='student' key={index}>
                <h3>{user.user.first_name} {user.user.last_name}</h3> 
                  <img 
                    className='profile-picture' 
                    src={user.user.profile_url} 
                    alt='user profile pic' 
                    onClick={(e) => handleClick(e, user.user.id)}
                  />
                <ul>
                  <li><i>Email: {user.user.email}</i> </li>
                  <li><i>GitHub: {user.user.github_url}</i></li>
                </ul>
              </div>
            ))}
          </div>

          <div className='border'>
            <h2>Availible Users</h2>
            {availibleUsers?.map((user, index) => (
              <div key={index}>
                <p>{user.user.first_name} {user.user.last_name}</p>
               	<button onClick={(e) => handleSubmitAddStudentToCohort(e, user.user.id)}>Add to Cohort</button>
              </div>
            ))}
          </div>

        </div>
      </>
  );
};

export default CohortPage;
