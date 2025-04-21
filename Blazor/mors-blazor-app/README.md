# Mors Blazor App

## Overview
The Mors Blazor App is a web application designed to provide an interactive testing experience for users to learn and practice Morse code. The application features a test page where users can convert Morse code to characters and vice versa.

## Project Structure
```
mors-blazor-app
├── Pages
│   └── MorsTest.razor        # Razor component for the Morse code test page
├── wwwroot
│   └── style.css             # CSS styles for the application
├── Shared                     # Directory for shared components and layouts
├── _Imports.razor            # Common namespaces and components for Razor files
├── App.razor                 # Root component for the Blazor application
├── Program.cs                # Entry point for the Blazor application
└── README.md                 # Documentation for the project
```

## Setup Instructions
1. **Clone the Repository**
   Clone the repository to your local machine using:
   ```
   git clone <repository-url>
   ```

2. **Navigate to the Project Directory**
   Change to the project directory:
   ```
   cd mors-blazor-app
   ```

3. **Install Dependencies**
   Ensure you have the .NET SDK installed. Restore the project dependencies using:
   ```
   dotnet restore
   ```

4. **Run the Application**
   Start the application with:
   ```
   dotnet run
   ```
   Open your browser and navigate to `https://localhost:5001` to access the application.

## Usage Guidelines
- Navigate to the "Mors Kodu Test" page to start the test.
- Select the test mode (Morse to Character or Character to Morse).
- Follow the on-screen instructions to input your answers.
- Check your answers and track your score.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for more details.