const App = () => {
  new Worker("src/lib/workers/sqlite-worker.ts", {
    type: "module",
  });
  return <h1>Hi welcome to dashboard</h1>;
};

export default App;
