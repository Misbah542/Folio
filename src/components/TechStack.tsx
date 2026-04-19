const TechStack = () => {
  return (
    <div className="techstack" id="techstack">
      <div className="techstack-watermark section-watermark">05</div>
      <span className="section-label">[ Tech Stack ]</span>
      <h2> My Android Techstack</h2>
      
      <div 
        className="tech-placeholder" 
        style={{ 
          minHeight: '600px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          marginTop: '2rem',
          border: '1px dashed rgba(255, 255, 255, 0.2)',
          borderRadius: '8px'
        }}
      >
        <p style={{ opacity: 0.5 }}>Tech Stack Content</p>
      </div>
    </div>
  );
};

export default TechStack;
