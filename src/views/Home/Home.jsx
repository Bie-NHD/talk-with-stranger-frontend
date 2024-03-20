import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { Avatar, Container, Menu, MenuItem, Tooltip } from "@mui/material";
import { deepPurple } from "@mui/material/colors";
import { Outlet, useNavigate } from "react-router-dom";
import { FenceTwoTone, Logout } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "../../store/userSlice";

const drawerWidth = 240;

const AvatarMenu = ({ anchor, onAnchorClose, onLogoutClicked }) => {
  const open = !!anchor;

  return (
    <>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={onAnchorClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 0.7,
              "& .MuiAvatar-root": {
                width: 32,
                height: 32,
                ml: -0.5,
                mr: 1,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
      >
        <MenuItem
          onClick={() => {
            onLogoutClicked();
            onAnchorClose();
          }}
        >
          {" "}
          <Logout />
          <span
            style={{
              marginLeft: "10px",
            }}
          >
            Log out
          </span>
        </MenuItem>
      </Menu>
    </>
  );
};

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Home() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchor, setAnchor] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  React.useEffect(() => {
    if (!currentUser) {
      navigate("/auth/signin", {
        replace: true,
      });
    }
  }, [currentUser]);

  const onAvatarClick = (e) => {
    setAnchor(e.currentTarget);
  };

  const closeMenu = () => {
    setAnchor(null);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogoutClicked = () => {
    dispatch(signOut());
  };

  const handleSideBarItemClicked = (index) => {
    switch (index) {
      case 0:
        navigate("/home/profile");
        break;
      case 1:
        navigate("/home/video-chat");
        break;
      default:
        return;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        sx={{
          background: deepPurple[800],
          backgroundImage:
            "-webkit-linear-gradient(to right, #0083B0, #00B4DB)",
        }}
        position="fixed"
        open={open}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Avatar
            onClick={onAvatarClick}
            src={currentUser.user_avatar}
            sx={{ mr: 2, cursor: "pointer", fontSize: "14px" }}
          >
            {`${currentUser?.user_first_name.charAt(
              0
            )} ${currentUser?.user_last_name.charAt(0)}`}
          </Avatar>
          <AvatarMenu
            anchor={anchor}
            onAnchorClose={closeMenu}
            onLogoutClicked={handleLogoutClicked}
          />
          <Typography variant="h6" noWrap component="div">
            {`${currentUser?.user_first_name} ${currentUser?.user_last_name}`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {["My Profile", "Video Chat"].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <Tooltip enterDelay={1500} placement="top-end" arrow title={text}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? "initial" : "center",
                    px: 2.5,
                  }}
                  onClick={() => handleSideBarItemClicked(index)}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : "auto",
                      justifyContent: "center",
                    }}
                  >
                    {index % 2 === 0 ? (
                      <AccountBoxIcon />
                    ) : (
                      <PhotoCameraFrontIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="div" sx={{ flexGrow: 1, p: 2 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
