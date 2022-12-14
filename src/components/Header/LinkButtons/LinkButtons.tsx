import React from 'react';
import { Link } from 'react-router-dom';
import { ButtonsContainer, ButtonWrap, LinkButton } from './styles';

const LinkButtons: React.FC = () => {
  const links = ['projects', 'todo', 'settings'];

  return (
    <ButtonsContainer>
      {links.map((item) => (
        <ButtonWrap key={item}>
          <Link to={`/${item}`}>
            <LinkButton type="submit">{item}</LinkButton>
          </Link>
        </ButtonWrap>
      ))}
    </ButtonsContainer>
  );
};

export default LinkButtons;
