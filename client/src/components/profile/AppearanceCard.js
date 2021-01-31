import styled from "@emotion/styled";
import {PROFILE_DARK_THEME_COLOR, PROFILE_LIGHT_THEME_COLOR} from "components/profile/ProfileSidebar";
import AppContext from "context/AppContext";
import React, {useContext} from "react";
import {Card} from "react-bootstrap";

const OptionCard = styled(Card)`
  min-width: 200px;
  width: 200px;
  max-width: 200px;
  cursor: pointer;
  margin: 0.5rem 1rem;
  
  .card-img {
    border-radius: .2rem;
  }
`;

const AppearanceCard = ({className, chosen, imgSrc, onClick}) => {
    const {user} = useContext(AppContext);
    let style;
    if(chosen) {
        style = {border: "2px solid " + (user.darkMode ? PROFILE_DARK_THEME_COLOR : PROFILE_LIGHT_THEME_COLOR)};
    } else {
        style = {border: "2px solid transparent"};
    }
    return <OptionCard className={className} onClick={onClick} style={style}>
        <Card.Img src={imgSrc}/>
    </OptionCard>
};

export default AppearanceCard;