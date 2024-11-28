# grp_7_iot

### **Description**
A content management dashboard designed to visualize and manage hierarchical data such as airlines, fleets, subfleets, and aircraft. The system provides real-time progress tracking, customizable views, and an intuitive interface for efficient content transfer management.

---

## **Table of Contents**
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)

---

## **Features**
- Navigate through hierarchical levels: `Airlines → Fleets → Subfleets → Aircraft`.
- Dynamic data fetching for each level.
- Pagination and collapsible rows for efficient data handling.
- Progress tracking for content transfers with visual indicators.
- Dark mode and light mode support.
- Pull plane data straight from AWS S3 Bucket.

---

## **Technologies Used**
### **Frontend**
- **React** with TypeScript
- **Material-UI** for styling and components

### **Backend**
- **Node.js** with **Express.js**
- RESTful API for fetching and transforming hierarchical data
- **MongoDB** and **MySQL**
- **AWS S3**

---

## **Installation**
Follow these steps to set up and run the project locally. Make sure to run **yarn** in the root, client, and server folder to download all dependencies.

### **Clone the Repository**
```bash
git clone the repository
cd grp_7_iot
yarn
cd client
yarn
yarn start
Open a new terminal.
cd server
yarn
yarn start
```

## Authors and acknowledgment
- Chandler Sihom: Frontend
- Phuong Nguyen: Backend
- Taewan Kim: Frontend, Backend
- Nick Leppik: Backend
- Kim Sang Huynh: Backend

## Project Status
 - Still in progress, but most of it is done already.