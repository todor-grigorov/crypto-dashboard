import React, { useContext } from "react";
import { ThemeModeContext } from "../../theme";
import { Box, IconButton, useTheme } from "@mui/material";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlined from "@mui/icons-material/PersonOutlined";
import { ThemeMode } from "../../types/ThemeMode";

const ButtonsList = () => {
  const theme = useTheme();
  const themeMode = useContext(ThemeModeContext);

  return (
    <Box display="flex">
      <IconButton onClick={themeMode.toggleThemeMode}>
        {theme.palette.mode === ThemeMode.DARK ? (
          <DarkModeOutlinedIcon />
        ) : (
          <LightModeOutlinedIcon />
        )}
      </IconButton>
      <IconButton>
        <NotificationsOutlinedIcon />
      </IconButton>
      <IconButton>
        <SettingsOutlinedIcon />
      </IconButton>
      <IconButton>
        <PersonOutlined />
      </IconButton>
    </Box>
  );
};

export default ButtonsList;
