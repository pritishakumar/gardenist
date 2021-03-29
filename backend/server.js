/** server listener for app */

const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, () => {
    console.log(`Backend server started on http://localhost:${PORT}`);
});
