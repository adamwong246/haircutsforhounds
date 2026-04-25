const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8000;

const staticPath = path.join(process.cwd(), 'dist');
app.use(express.static(staticPath));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}, serving ${staticPath}`);
});
