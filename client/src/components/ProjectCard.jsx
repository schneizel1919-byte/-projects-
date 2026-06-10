import { Link } from 'react-router-dom';
import { formatUrl } from '../utils/formatUrl';

const ProjectCard = ({ project }) => {
  return (
    <Link to={`/project/${project._id}`} style={{ display: 'block' }}>
      <div style={{ 
        width: '100%', 
        aspectRatio: '1 / 1', 
        backgroundColor: 'var(--gray-light)',
        marginBottom: '16px',
        border: '1px solid var(--gray-border)',
        backgroundImage: project.coverImageUrl ? `url(${formatUrl(project.coverImageUrl)})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'opacity 0.2s'
      }} 
      onMouseOver={(e) => e.currentTarget.style.opacity = '0.8'}
      onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
      />
      
      <h3 style={{ fontSize: '16px', fontWeight: '600', letterSpacing: '-0.5px', marginBottom: '4px' }}>
        {project.title}
      </h3>
      <p style={{ fontSize: '14px', color: 'gray' }}>
        {project.artist?.name || 'Bilinmeyen Sanatçı'}
      </p>
    </Link>
  );
};

export default ProjectCard;
