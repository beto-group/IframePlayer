/**
 * Iframe Player - Index Factory
 */
async function View({ folderPath, dc, initialUrl = "https://www.youtube.com/embed/bsL7ZnKIAhs" }) {
  const Agent = {
    timer: null,
    start: (fPath, onReload) => {
      const cmdFile = fPath + "/data/mcp_commands.json";
      Agent.timer = setInterval(async () => {
        try {
          const adapter = dc.app.vault.adapter;
          if (!(await adapter.exists(cmdFile))) return;
          const content = await adapter.read(cmdFile);
          const cmd = JSON.parse(content);
          if (cmd && cmd.executed === false && cmd.action === "reload") {
            cmd.executed = true;
            cmd.executedAt = new Date().toISOString();
            await adapter.write(cmdFile, JSON.stringify(cmd, null, 2));
            onReload();
          }
        } catch (e) {}
      }, 1000);
      return () => clearInterval(Agent.timer);
    }
  };

  const SafeRoot = () => {
    const [modules, setModules] = dc.useState(null);
    const [error, setError] = dc.useState(null);
    const [key, setKey] = dc.useState(0);

    dc.useEffect(() => {
      return Agent.start(folderPath, () => {
        if (dc.app.workspace.activeLeaf?.rebuildView) {
          dc.app.workspace.activeLeaf.rebuildView();
        } else {
          setKey((k) => k + 1);
        }
      });
    }, []);

    dc.useEffect(() => {
      const load = async () => {
        try {
          const base = folderPath;
          const [
            playerModule,
          ] = await Promise.all([
            dc.require(base + "/src/components/IframePlayer.jsx"),
          ]);
          setModules({
            IframePlayer: playerModule,
          });
        } catch (e) {
          setError(e);
        }
      };
      load();
    }, [key]);

    if (error) {
      return (
        <div style={{ color: "red", padding: "40px", background: "#000", height: "100vh" }}>
          <h2 style={{ color: "#ff4444" }}>Critical Load Error</h2>
          <pre style={{ fontSize: "12px", color: "#ffbbbb" }}>{error.stack}</pre>
        </div>
      );
    }
    if (!modules) {
      return (
        <div style={{ padding: "40px", background: "#000", color: "#666", height: "100vh", fontFamily: "monospace" }}>
          Initializing Iframe Player...
        </div>
      );
    }

    const { IframePlayer } = modules;
    const { View: PlayerView } = IframePlayer;
    return (
      <div id="datacore-component-root" style={{ width: "100%", height: "100%" }}>
        <PlayerView initialUrl={initialUrl} />
      </div>
    );
  };

  return <SafeRoot />;
}

return { View };
