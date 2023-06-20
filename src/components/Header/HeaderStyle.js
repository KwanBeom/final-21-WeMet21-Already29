import styled from "styled-components";

export const HeaderUI = styled.header`
  display: flex;
  justify-content: space-between;
  padding: 12px 10px;
  max-height: 48px;
  align-items: center;
  box-sizing: border-box;
  gap: 12px;
  border-bottom: 1px solid var(--line-gray-color);

  h2 {
    font-size: 1.4rem;
    flex-grow: 1;
  }
`;

export const Logo = styled.button`
  border: 0;
  padding: 5px;
  background-color: initial;

  img {
    width: 65px;
  }
`;

export const HeaderButton = styled.button`
  border: 0;
  padding: 0;
  background: initial;
  width: 24px;
  height: 24px;
`;

export const HeaderInput = styled.input`
  font-size: 1.4rem;
  flex-grow: 1;
  background-color: #f2f2f2;
  border: 0;
  padding: 5px 16px;
  border-radius: 20px;
`;
