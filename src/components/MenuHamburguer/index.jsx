import React from "react";
import { slide as  Menu } from "react-burger-menu";
import { Container } from "./styled";

const MenuHamburguer = props => {
    return(
        <Container>
            <Menu right width={100}>
                <a className="menu-item" href="/">
                    Sair
                </a>
            </Menu>
        </Container>
    );
};

export default MenuHamburguer;