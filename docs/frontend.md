# Table of Contents
1. [Important API calls](#important-api-calls)

2. [GroupView.jsx Component](#groupviewjsx-component)
   - [Key Features](#key-features)
   - [Key Components and Props](#key-components-and-props)
   - [State Variables](#state-variables)

3. [ExpandedAirlines.tsx and ExpandedFleet.tsx Component](#expandedairlinestsx-and-expandedfleettsx-component)
   - [Purpose](#purpose)
   - [Props](#props)
   - [State](#state)

4. [AirlineTable.js and fleetTable.js Component](#airlinetablejs-and-fleettablejs-component)
   - [Purpose](#purpose-1)
   - [Props](#props-1)

5. [CollapsibleTable/groupTable.js Component](#collapsibletablegrouptablejs-component)
   - [Purpose](#purpose-2)
   - [Props](#props-2)
   - [Key Features](#key-features-1)

6. [Dashboard.tsx Component](#dashboardtsx-component)
   - [Purpose](#purpose-3)
   - [Props](#props-3)
   - [Key Features](#key-features-2)

---

# Important API calls
- **http://localhost:4000/api/airlines**:
    - Retrieves an array of all airlines.
- **http://localhost:4000/api/fleets?airline=${airlineName}**:
    - Retrieves all fleets related to the passed in airline.
- **http://localhost:4000/api/subfleets?airline=${airlineName}&fleet=${fleetName}**:
    - Retrieves all subfleets related to the passed in airline and fleet.
- **http://localhost:4000/api/progress/?airline=${airlineName}&fleet=${fleetName}&subfleet=${subfleetName}&tailID=${tailID}**:
    - Retrieves all aircrafts and their content progress data from the passed in airline, fleet, and sub fleet names.

---

# GroupView.jsx Component
The `GroupView` component is the main dashboard of the application, responsible for rendering a dynamic view that allows navigation through various levels (airlines, fleets, subfleets, and aircraft).

## Key Features
- **Hierarchical Navigation**:
  - Allows users to move between `airlines`, `fleet`, `subfleet`, and `aircraft` views.
  - Breadcrumb-style navigation for easy backtracking.
  
- **Dynamic Data Fetching**:
  - Fetches and displays data for the current level using an API.
  - Uses React's `useEffect` for asynchronous data fetching based on state changes.

- **Dark Mode Support**:
  - Toggles between light and dark themes.
  - Stores the user’s theme preference in `localStorage`.

## Key Components and Props
- **`ExpandedAirlines`**: Displays the list of airlines.
- **`ExpandedFleet`**: Displays the list of fleets.
- **`BasicTable`**: A reusable table component for rendering data of sub fleets or aircraft depending on the level.

## State Variables
- `currentLevel`: Tracks the current hierarchy level (e.g., airlines, fleet).
- `isDarkMode`: Toggles the light/dark theme.
- `airlineName`, `fleetName`, `subfleetName`: Store selected entity names for navigation and backend API calls.

---

# ExpandedAirlines.tsx and ExpandedFleet.tsx Component
The `ExpandedAirlines` component is a component responsible for displaying a paginated list of airlines/fleets and providing navigation to subsequent levels in the hierarchy.

## Purpose
- Displays airline data in a table format and allows users to navigate to the `fleet/subfleet` level by interacting with the data.

## Props
### `ExpandedAirlinesProps`
The component accepts the following props:

- **`data: string[]`**  
  An array of airline/fleet names to be displayed.

- **`handleLevelChange: (level: string, name: string) => void`**  
  A callback function invoked when a user selects an airline to navigate to the next level.  
  - `level`: The target level (`fleet/subfleet` in this case).  
  - `name`: The name of the selected airline/fleet.

- **`itemsPerPage: number`**  
  Specifies the number of items displayed per page.

## State
- **`pageCount: number`**  
  Tracks the starting index of the current page for slicing the `data` array.

---

# AirlineTable.js and fleetTable.js Component

The `AirlineTable` component renders a table displaying a paginated list of airline names by mapping over the data array passed in.

## Purpose
- Displays airline/fleet data in a structured table format.

## Props
The component accepts the following props:

- **`data: string[]`**  
  An array of airline/fleet names to be displayed.

- **`pageCount: number`**  
  The starting index for slicing the `data` array, based on the current page.

- **`itemsPerPage: number`**  
  Specifies the number of rows displayed per page.

- **`handleLevelChange: (level: string, name: string) => void`**  
  A callback function invoked when a row is clicked, allowing navigation to the `fleet/subfleet` level.
  - `level`: The target level (`fleet/subfleet` in this case).  
  - `name`: The name of the selected airline/fleet.

---

# CollapsibleTable/groupTable.js Component

The `CollapsibleTable` component renders a table with collapsible rows. Each row can expand to show additional details or metadata.

## Purpose
- Allows rows to expand or collapse to show more detailed information.
- Supports hierarchical navigation through row interactions.

## Props

### Required Props
- **`data: string[]`**  
  Array of data to display in the table rows.

- **`handleLevelChange: (level: string, name: string) => void`**  
  Callback function triggered when navigating to a new hierarchy level.  
  - `level`: The target level (e.g., subfleets).  
  - `name`: The selected row's name.

- **`airlineName: string`**  
  The name of the current airline.

- **`fleetName: string`**  
   The name of the current fleet.

- **`subfleetName: string`**  
   The name of the current sub fleet.

- **`sortCategory: string`**  
  Defines the category used for sorting rows (not specifically used anymore and can be safely removed).

- **`transfers: object[]`**  
  Array of data containing transfer details for aircraft rows.

- **`level: string`**  
  Current hierarchy level (`subfleets`, `aircraft`, etc.), which influences table headers and row behavior.

- **`itemsPerPage: number`**  
  Number of rows displayed per page.

- **`isDarkMode: boolean`**  
  Determines if the table should render in dark mode.

## Key Features
### 1. **Collapsible Rows**:
- Each row has an expand/collapse toggle button (`KeyboardArrowUpIcon`/`KeyboardArrowDownIcon`).
- Expanded rows render additional content (e.g., metadata) using the `Dashboard` component.

### 2. **Dynamic Headers**:
- Renders headers dynamically based on the `level` prop.
- Example:
  - For `subfleets`: Displays columns like `Sub Fleets`, `Started`, `Finished`, and a progress bar.
  - For `aircraft`: Displays `Tail IDs`.

---

# Dashboard.tsx Component
The `Dashboard` component is a customizable table for displaying content or tail transfer data. The design is built for both "aircraft" and "fleet" levels, rendering the appropriate columns and rows based on the `level` prop. For each tail ID or subfleet it will have it's own individualized dashboard component so the passed in sub fleet or tail ID will change with each iteration of a sub fleet or tail ID.

## Purpose
- Displays transfer progress and status in a table format.
- Handles different data representations for "aircraft" and "fleet" levels.
- Shows progress of specific content or tail IDs.

## Props

### Required Props
- **`transfers: ContentTransfer[] | TailTransfer[]`**  
  The data array representing transfers, each containing keys and corresponding states (e.g., progress, status).

- **`itemsPerPage: number`**  
  Specifies how many rows to display per page.

- **`airlineName: string`**  
  The name of the current airline.

- **`fleetName: string`**  
   The name of the current fleet.

- **`subfleetName: string`**  
   The name of the current sub fleet.

- **`tailID: string`**  
   The name of the passed in tail ID.

- **`level: string`**  
  Defines the current hierarchy level, either `"aircraft"` or `"fleet"`.  
  - `"aircraft"`: Displays specific content progress and metadata.  
  - `"fleet"`: Displays basic progress and status columns of tail IDs cumulative progress of content upload progresses.

- **`isDarkMode: boolean`**  
  Determines whether the component uses dark or light mode styling.

## Key Features

### 1. **Dynamic Leveling Display**
The `Dashboard` component uses separate displays for `aircraft` and `fleet` levels.

#### `TailHead` (for Aircraft Level)
Includes content, progress, bitrate, and status columns.

#### `FleetHead` (for Fleet Level)
Includes tail, progress, and status columns.

### `Status coloring`
Depending on the current status of content (i.e "finished"), it will use getStatusColor() or getBackgroundStatusColor(status) to dynamically change the color of status.

### `Calculate progress`
Using calculateProgress() it will calculate the current progress download count out of the total file size.

### `Data fetching`
Depending on the current level it will switch between pulling sub fleet or aircraft data. Both levels with transform the fetched data to synchronize and match with the data type that is specified and required by sanatized data.