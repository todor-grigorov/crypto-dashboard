import React, { useContext } from "react";
import { Box, useTheme } from "@mui/material";
import { ThemeModeContext, tokens } from "../../theme";

import Search from "../../components/BarElemets/Search";
import ButtonsList from "../../components/BarElemets/ButtonsList";

const TopBar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box display={"flex"} justifyContent="space-between" p={2}>
      <Search />
      <ButtonsList />
    </Box>
  );
};

export default TopBar;
