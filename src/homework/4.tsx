import React, { createContext, useMemo, useState, useContext, ReactNode, } from "react";
import noop from "lodash/noop";

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string };

// Додати тип Menu Selected
type MenuSelected = { id: MenuIds };
type MenuAction = { onMenuSelected: (menuSelected: MenuSelected) => void };

const MenuSelectedContext = createContext<{ menuSelected: MenuSelected }>({
  menuSelected: {id: 'first'},
});

// Додайте тип MenuAction
const MenuActionContext = createContext<MenuAction>({
  onMenuSelected: noop,
});

type PropsProvider = {
  children: ReactNode; // Додати тип для children
};

function MenuProvider({ children }: PropsProvider) {
  // Додати тип для MenuSelected він повинен містити { id }
  const [menuSelected, setMenuSelected] = useState<MenuSelected>({ id: "first",});

  const menuContextAction = useMemo(() => ({ onMenuSelected: setMenuSelected,}),[]);

  const menuContextSelected = useMemo(() => ({menuSelected,}),[menuSelected]);

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[]; // Додайте вірний тип для меню
};

function MenuComponent({ menus }: PropsMenu) {
  const { onMenuSelected } = useContext(MenuActionContext);
  const { menuSelected } = useContext(MenuSelectedContext);

  return (
    <>
      {menus.map((menu) => (
        <div key={menu.id} onClick={() => onMenuSelected({ id: menu.id })}>
          {menu.title}{" "}
          {menuSelected.id === menu.id ? "Selected" : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}
