import React from 'react';
import styles from '../../Pages/AdminView/AdminDashboard.module.css';
const articles = [
  { title: 'React Tips', views: '2.9k', comments: '210', status: 'Published' },
  { title: 'Vue Basics', views: '1.2k', comments: '85', status: 'Draft' },
  { title: 'Angular Guide', views: '3.4k', comments: '310', status: 'Published' }
];

const RecentArticles = () => {
  return (
    <div className={`card ${styles.articlesCard}`}>
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Recent Articles</h5>
        <button className="btn btn-sm btn-primary">View All</button>
      </div>
      <div className="card-body p-0">
        <table className="table mb-0">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Views</th>
              <th>Comments</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a, i) => (
              <tr key={i}>
                <td>{a.title}</td>
                <td>{a.views}</td>
                <td>{a.comments}</td>
                <td>
                  <span className={`badge ${a.status === 'Published' ? 'bg-success' : 'bg-secondary'}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentArticles;
