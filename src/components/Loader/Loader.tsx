import React, { useEffect, useState } from "react";
import "./Loader.css";
import styled from "styled-components";
import SvgSpinner from "../../../src/icons/Spinner";
import { useZakeke } from "@zakeke/zakeke-configurator-react";

export interface LoaderProps {
  visible: boolean;
  loadingText?: string;
}

const Loader: React.FC<LoaderProps> = (props) => {
  const { isSceneLoading } = useZakeke();
  const [completed, setCompleted] = useState<number | null>(0);

  const ProgressBarLoadingBackground = styled.div`
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 12;
  `;

  const ProgressBarLoadingContainer = styled.div`
    width: 650px;
    height: 150px;
    padding: 10px;
    display: inline-flex;
    padding: 48px 24px;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    border-radius: 4px;
    background: var(--surface-default, #fff);
    box-shadow: 0px 4px 20px 0px rgba(0, 0, 0, 0.15),
      0px 0px 3px 0px rgba(0, 0, 0, 0.1);

    @media screen and (max-width: 766px) {
      width: 350px;
      height: 140px;
    }
  `;

  const LoadingLabel = styled.div`
    color: #000;
    font-size: 12px;
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    line-height: 16px;
  `;

  const LoaderContainer = styled.div`
    height: 8px;
    width: 600px;
    border-radius: 4px;

    @media screen and (max-width: 766px) {
      width: 310px;
    }
  `;

  const LoadingPercentageLabel = styled.span`
    color: #8fa4ae;
    font-weight: 400;
    font-size: 12px;
    line-height: 16px;
    font-style: normal;
    font-family: "Inter";
  `;

  const LoadingPercentageandIconContainer = styled.div`
    display: flex;
    justify-content: space-between;
  `;

  // const CheckIcon = styled(Icon)`
  //   cursor: unset;
  //   color: #008556;
  // `;

  const LoaderFill = styled.div<{ completed?: any }>`
    height: 100%;
    border-radius: 4px;
    margin: 7px 0px;
    background-color: #000000;
    border-radius: "inherit";
    width: ${({ completed }) => completed && `${completed}%`};
  `;

  //width: ${({ completed }) => completed && `${completed}%`};

  useEffect(() => {
    let currentProgress = 0;
    let step = 0.3;

    if (!isSceneLoading) setCompleted(100.0);
    else if (isSceneLoading) {
      const interval = setInterval(() => {
        currentProgress += step;
        setCompleted(
          Math.round(
            (Math.atan(currentProgress / 2) / (Math.PI / 2)) * 100 * 100
          ) / 100
        );
      }, 50);

      return () => clearInterval(interval);
    }
  }, [isSceneLoading]);

  return (
    <div>
      <ProgressBarLoadingBackground>
        <ProgressBarLoadingContainer>
          <LoadingLabel>
            {/* {console.log(T.d('Loading..'),'esfdfsfdssfds');} */}
            Loading...
            {/* {isSceneLoading ? T._('Loading your product...', 'Composer') : T._('Loading complete.', 'Composer')} */}
          </LoadingLabel>
          <LoaderContainer>
            <LoaderFill
              completed={isSceneLoading ? completed : 100}
              // isCompleted={!isSceneLoading}
            />
            <LoadingPercentageandIconContainer>
              <LoadingPercentageLabel>
                {isSceneLoading ? `${completed}%` : "100%"}
              </LoadingPercentageLabel>
            </LoadingPercentageandIconContainer>
          </LoaderContainer>
        </ProgressBarLoadingContainer>
      </ProgressBarLoadingBackground>
    </div>
  );

  // return (
  //   <div
  //     data-testid="loader"
  //   >
  //     <div
  //       className="loader"
  //     >
  //       <SvgSpinner />
  //     </div>
  //     {props.loadingText && (
  //         <span>{props.loadingText}</span>
  //     )}
  //   </div>
  // );
};

export default Loader;
