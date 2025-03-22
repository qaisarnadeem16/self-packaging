import React from "react";
import { FC } from "react";
import styled from "styled-components";

const FormControlLabel = styled.div`
  padding: 10px 0px;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const FormControlContainer = styled.div<{ rightComponent?: any, placeholder?: any }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  grid-gap: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const FormControl: FC<{
  label: string;
  rightComponent?: any;
  children?: React.ReactNode;
  placeholder?: string;
}> = ({ placeholder, label, rightComponent, children }) => {
  return (
    <FormControlContainer placeholder={placeholder}>
      <FormControlLabel>
        <span style={{width: '70px'}}>{label}</span>
        {rightComponent}
      </FormControlLabel>
      {children}
    </FormControlContainer>
  );
};
