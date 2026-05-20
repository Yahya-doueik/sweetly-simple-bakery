import { r as reactExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
function MenuRedirect() {
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    navigate({
      to: "/",
      hash: "menu"
    });
  }, [navigate]);
  return null;
}
export {
  MenuRedirect as component
};
