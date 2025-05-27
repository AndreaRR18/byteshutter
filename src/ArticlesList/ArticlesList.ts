document.addEventListener("DOMContentLoaded", () => {
    const contentDiv = document.getElementById("content");
    if (contentDiv) {
        contentDiv.innerHTML = "Hello, this is content loaded from TypeScript!";
    }
});
