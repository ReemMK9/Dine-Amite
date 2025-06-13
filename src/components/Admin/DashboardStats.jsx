import React from 'react';
import styles from '../../Pages/AdminView/AdminDashboard.module.css';

const stats = [
  { title: 'Article Views', value: '60.5k' },
  { title: 'Likes', value: '150' },
  { title: 'Comments', value: '320' },
  { title: 'Published', value: '70' }
];

const DashboardStats = () => {
  return (
    <div className="row">
      {stats.map((stat, index) => (
        <div key={index} className="col-12 col-sm-6 col-lg-3 mb-4">
          <div className={`card text-center ${styles.statCard}`}>
            <div className="card-body">
              <h5 className="card-title">{stat.title}</h5>
              <p className="card-text fs-4 fw-bold">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
