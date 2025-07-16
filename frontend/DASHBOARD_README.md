# Dashboard System Documentation

This document describes the dashboard system implementation for both students and teachers in the Vue.js application.

## Overview

The dashboard system provides a unified interface for both students and teachers with shared components, layouts, and styling. It uses the SCSS variables defined in `_variable.scss` for consistent theming.

## Architecture

### Layout Structure
```
frontend/src/
├── layout/dashboard/
│   └── DashboardLayout.vue          # Main dashboard layout component
├── components/dashboard/
│   └── DashboardNav.vue             # Navigation component
├── pages/student/
│   ├── StudentDashboard.vue         # Student main dashboard
│   └── StudentCourses.vue           # Student courses page
├── pages/teacher/
│   └── TeacherDashboard.vue         # Teacher main dashboard
└── assets/scss/custom/
    ├── _variable.scss               # Main variables
    ├── _dashboard.scss              # Main dashboard styles
    ├── components/_dashboard.scss   # Dashboard component styles
    └── pages/_dashboard.scss        # Dashboard page styles
```

## Components

### DashboardLayout.vue
The main layout component that provides:
- Collapsible sidebar with navigation
- Top header with user menu and notifications
- Responsive design for mobile devices
- User information display
- Mobile overlay for sidebar

**Props:**
- `userName`: User's display name
- `userRole`: User's role (Student/Teacher)
- `userAvatar`: User's avatar image URL
- `currentPage`: Current page title
- `notificationCount`: Number of notifications

**Slots:**
- `sidebar-nav`: Navigation menu content
- `content`: Main page content
- `breadcrumb`: Custom breadcrumb (optional)
- `header-actions`: Custom header actions (optional)

### DashboardNav.vue
Navigation component that provides:
- Menu items with icons and labels
- Active state highlighting
- Collapsible submenu support
- Badge support for notifications
- Responsive behavior

**Props:**
- `navItems`: Array of navigation items
- `collapsed`: Whether sidebar is collapsed

## Styling System

### SCSS Variables
The dashboard uses the following variables from `_variable.scss`:

**Colors:**
- `$pink`: Primary brand color (#e50071)
- `$black`: Text color (#000000)
- `$white`: Background color (#ffffff)
- `$yellow`: Accent color (#ED9F10)
- `$orange`: Secondary accent (#ea8014)

**Typography:**
- `$font-family-primary-*`: Inter font family variants
- `$font-weight-*`: Font weight values
- `$font-size-*`: Fluid typography scale

**Spacing:**
- `$space-*`: Fluid spacing scale
- `$step-*`: Typography step values

### Style Organization
1. **`_dashboard.scss`**: Main dashboard styles and imports
2. **`components/_dashboard.scss`**: Component-specific styles
3. **`pages/_dashboard.scss`**: Page-specific styles

## Routing

### Student Routes
- `/student/dashboard` - Main dashboard
- `/student/courses` - Course management
- `/student/assignments` - Assignment view
- `/student/grades` - Grade tracking
- `/student/calendar` - Calendar view
- `/student/resources` - Resource library
- `/student/profile` - User profile

### Teacher Routes
- `/teacher/dashboard` - Main dashboard
- `/teacher/courses` - Course management
- `/teacher/assignments` - Assignment management
- `/teacher/students` - Student management
- `/teacher/grades` - Grade management
- `/teacher/calendar` - Calendar view
- `/teacher/analytics` - Analytics dashboard
- `/teacher/profile` - User profile

## Features

### Shared Features
- **Responsive Design**: Mobile-first approach with breakpoints
- **Theme Consistency**: Uses SCSS variables for consistent styling
- **Accessibility**: ARIA labels and keyboard navigation support
- **Performance**: Lazy-loaded components and optimized rendering

### Student Dashboard Features
- Course overview with progress tracking
- Assignment deadlines and submissions
- Grade tracking and analytics
- Recent activity feed
- Quick access to resources

### Teacher Dashboard Features
- Course management interface
- Student submission tracking
- Grade management tools
- Class scheduling
- Analytics and reporting
- Quick action buttons

## Usage

### Basic Implementation
```vue
<template>
  <DashboardLayout
    :user-name="userName"
    :user-role="userRole"
    :user-avatar="userAvatar"
    :current-page="currentPage"
    :notification-count="notificationCount"
    @logout="handleLogout"
    @profile="handleProfile"
    @settings="handleSettings"
  >
    <template #sidebar-nav>
      <DashboardNav :nav-items="navItems" :collapsed="false" />
    </template>

    <template #content>
      <!-- Your page content here -->
    </template>
  </DashboardLayout>
</template>
```

### Navigation Configuration
```javascript
const navItems = ref([
  {
    id: 'dashboard',
    label: 'Dashboard',
    path: '/student/dashboard',
    icon: 'fas fa-tachometer-alt'
  },
  {
    id: 'courses',
    label: 'My Courses',
    path: '/student/courses',
    icon: 'fas fa-book'
  }
  // ... more items
])
```

## Customization

### Adding New Pages
1. Create a new Vue component in the appropriate directory
2. Use the `DashboardLayout` component as the wrapper
3. Configure navigation items
4. Add routing configuration
5. Style using the provided SCSS variables

### Styling Customization
1. Use SCSS variables from `_variable.scss` for consistency
2. Follow the established naming conventions
3. Add responsive breakpoints for mobile compatibility
4. Use the provided utility classes when possible

### Theme Customization
To change the theme colors:
1. Update the color variables in `_variable.scss`
2. The changes will automatically apply to all dashboard components
3. Test across different screen sizes for consistency

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for tablets and mobile devices

## Performance Considerations
- Components are lazy-loaded for better initial load times
- Images are optimized and use proper sizing
- CSS is scoped to prevent style conflicts
- Minimal JavaScript for smooth interactions

## Future Enhancements
- Dark mode support
- Advanced filtering and search
- Real-time notifications
- Offline support
- Advanced analytics dashboard
- Customizable dashboard widgets 