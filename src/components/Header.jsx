import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

function Header() {
  return (
    <Toolbar
      sx={{ borderBottom: "1px solid #ccc", borderBottomStyle: "dashed" }}
    >
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="/"
        sx={{
          mr: 2,
          display: { xs: "none", md: "flex" },
          fontFamily: "monospace",
          fontWeight: 700,
          letterSpacing: ".3rem",
          color: "#999",
          textDecoration: "none",
        }}
      >
        COVID Tracker
      </Typography>
    </Toolbar>
  );
}
export default Header;
