# IOS Notes:

A sleek, infinite canvas notes application inspired by iOS design, featuring glassmorphism effects and smooth interactions.

## Features

- **Infinite Canvas**: Pan and zoom infinitely across a virtual board
- **iOS-Style Notes**: Beautiful glassmorphism notes with backdrop blur effects
- **Drag & Drop**: Move notes around by dragging their headers
- **Resizable Notes**: Resize notes from any corner
- **Color Customization**: Change note colors using the built-in color picker
- **Auto-Save**: All notes and board state are automatically saved to localStorage
- **Undo Functionality**: Press Ctrl+Z to undo the last action
- **Align Notes**: Press Ctrl+L to neatly align all notes in a grid
- **Zoom Controls**: Use + and - buttons or mouse wheel for zooming
- **Reset View**: Reset zoom and position with the reset button
- **Delete Options**: Delete individual notes or clear the entire board
- **Edge Panning**: Automatically pan when dragging notes near screen edges
- **Grid Background**: Subtle grid pattern that scales with zoom

## How to Use

1. **Open the HTML file** in any modern web browser
2. **Create Notes**: Click the "+" floating action button or use the info button for help
3. **Edit Notes**: Click inside a note to type text
4. **Move Notes**: Drag the note header to reposition
5. **Resize Notes**: Drag from any corner to resize
6. **Change Colors**: Click the color dot in the note header to pick a new color
7. **Navigate Board**: 
   - Hold Shift + drag to pan the board
   - Use + and - buttons to zoom
   - Use mouse wheel for zooming
8. **Keyboard Shortcuts**:
   - Ctrl+Z: Undo last action
   - Ctrl+L: Align all notes
9. **Delete Notes**: Click the "✕" button in the note header
10. **Clear Board**: Click the trash icon in the FAB menu

## What I Learned from Coding This

This project was an excellent opportunity to deepen my understanding of modern web development techniques:

### HTML & CSS
- **CSS Variables**: Using CSS custom properties for consistent theming
- **Backdrop Filter**: Implementing iOS-style glassmorphism with `backdrop-filter: blur()`
- **CSS Transforms**: Applying scale, rotate, and translate transforms for smooth animations
- **Flexbox Layout**: Creating responsive and flexible UI components
- **CSS Grid**: Understanding background patterns and positioning
- **Responsive Design**: Using viewport units and media queries for mobile compatibility

### JavaScript
- **DOM Manipulation**: Dynamically creating, modifying, and removing HTML elements
- **Event Handling**: Managing mouse events, keyboard shortcuts, and touch interactions
- **Local Storage**: Persisting application state between sessions
- **Math & Geometry**: Calculating positions, scales, and transformations for infinite canvas
- **Object-Oriented Concepts**: Managing complex state with JavaScript objects
- **Asynchronous Programming**: Handling user interactions and state updates efficiently
- **Browser APIs**: Utilizing modern browser features like `backdrop-filter` and CSS transforms

### User Experience Design
- **Interaction Design**: Creating intuitive drag-and-drop interfaces
- **Visual Feedback**: Providing visual cues for user actions (hover states, scaling)
- **Performance Optimization**: Using `will-change` and efficient DOM updates
- **Accessibility**: Considering keyboard navigation and screen reader compatibility

### Development Practices
- **Modular Code**: Organizing JavaScript functions for maintainability
- **Error Handling**: Implementing graceful fallbacks and user confirmations
- **Cross-Browser Compatibility**: Ensuring the app works across different browsers
- **Version Control**: Managing code changes and features incrementally

This project demonstrates the power of vanilla JavaScript and CSS in creating sophisticated web applications without relying on heavy frameworks.