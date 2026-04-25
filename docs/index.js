window.addEventListener('DOMContentLoaded', event => {
	console.log('DOM fully loaded and parsed');

	// // Initial state
	// var scrollPos = 0;
	// window.addEventListener('scroll', function(){
	//   // detects new state and compares it with the new one
	//   if ((document.body.getBoundingClientRect()).top > scrollPos)
	//     document.body.classList.remove("hide-menu");
	//   else
	//     document.body.classList.add("hide-menu");

	//   // saves the new position for iteration.
	//   scrollPos = (document.body.getBoundingClientRect()).top;
	// });

	// // Select the button
	// const btn = document.querySelector(".dark-toggle");
	// // Check for dark mode preference at the OS level
	// const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

	// // Get the user's theme preference from local storage, if it's available
	// const currentTheme = localStorage.getItem("theme");
	// // If the user's preference in localStorage is dark...
	// if (currentTheme === "dark") {
	//   // ...let's toggle the .dark-theme class on the body
	//   document.body.classList.toggle("dark-theme");
	// // Otherwise, if the user's preference in localStorage is light...
	// } else {
	//   // ...let's toggle the .light-theme class on the body
	//   document.body.classList.toggle("light-theme");
	// }
});

// function toggleDark() {

//   // Get the user's theme preference from local storage, if it's available
//   const currentTheme = localStorage.getItem("theme");

//   // If the user's preference in localStorage is dark...
//   if (currentTheme === "dark") {
//     document.body.classList.remove("dark-theme");
//     localStorage.setItem("theme", "light")

//   } else {
//     document.body.classList.add("dark-theme");
//     localStorage.setItem("theme", "dark")
//   }
// }

// function openMenu() {
//     document.body.classList.toggle("closed-menu");
//     document.body.classList.remove("animate-logo");
// }
