import React from 'react';
import styled from 'styled-components';

const AnimCard = ({ icon, image, title, description }) => {
  return (
    <StyledWrapper>
      <div className="card">
        {icon ? (
          <div className="icon">{icon}</div>
        ) : image ? (
          <img src={image} alt={title} className="image" />
        ) : null}
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    width: 220px;
    height: 300px;
    background: #07182E;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 20px;
    padding: 20px;
    box-sizing: border-box;
  }

  .card .icon {
    z-index: 1;
    margin-bottom: 10px;
  }

  .card .image {
    z-index: 1;
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
    margin-bottom: 10px;
  }

  .card h2 {
    z-index: 1;
    color: white;
    font-size: 1.5em;
    margin: 10px 0;
    text-align: center;
  }

  .card p {
    z-index: 1;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9em;
    text-align: center;
    padding: 0 10px;
  }

  .card::before {
    content: '';
    position: absolute;
    width: 120px;
    background-image: linear-gradient(180deg, rgb(0, 183, 255), rgb(255, 48, 255));
    height: 140%;
    animation: rotBGimg 3s linear infinite;
    transition: all 0.2s linear;
  }

  @keyframes rotBGimg {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .card::after {
    content: '';
    position: absolute;
    background: #07182E;
    inset: 5px;
    border-radius: 15px;
  }

  /* Optional hover effect (uncomment if desired) */
  /* .card:hover::before {
    background-image: linear-gradient(180deg, rgb(81, 255, 0), purple);
    animation: rotBGimg 3.5s linear infinite;
  } */
`;

export default AnimCard;