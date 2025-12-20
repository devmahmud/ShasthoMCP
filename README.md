# 🏥 Bangladeshi Doctors Directory MCP Server

A Model Context Protocol (MCP) server that provides AI assistants with access to a comprehensive directory of Bangladeshi doctors, hospitals, and medical specialists.

## ✨ Features

- **Search Doctors** - Find doctors by name (English or Bengali)
- **Filter by Specialty** - Browse 24+ medical specialties
- **Filter by Location** - Search across 8 divisions and 64 districts
- **Hospital Directory** - Find doctors by hospital or clinic (50+ hospitals)
- **Chamber Schedules** - Get complete weekly schedules with timings and fees
- **Today's Availability** - Find doctors available on the current day
- **Telemedicine Support** - Filter doctors offering online consultations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
cd doctor-mcp

# Install dependencies
npm install

# Create PostgreSQL database
createdb doctors_db
# Or using psql:
# psql -U your_user -c "CREATE DATABASE doctors_db;"

# Configure environment variables (optional)
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=your_username
export DB_PASSWORD=your_password
export DB_NAME=doctors_db

# Setup database (migrate + seed)
npm run db:setup

# Build the project
npm run build
```

### Database Configuration

The server uses environment variables for database configuration. Update in `src/db/connection.ts` or set environment variables:

| Variable      | Default     | Description       |
| ------------- | ----------- | ----------------- |
| `DB_HOST`     | localhost   | PostgreSQL host   |
| `DB_PORT`     | 5432        | PostgreSQL port   |
| `DB_USER`     | mahmud      | Database user     |
| `DB_PASSWORD` | admin@12345 | Database password |
| `DB_NAME`     | doctors_db  | Database name     |

### Running the Server

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔧 Configuration

### Claude Desktop

Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "doctor-mcp": {
      "command": "node",
      "args": ["/path/to/doctor-mcp/dist/index.js"],
      "env": {
        "DB_HOST": "localhost",
        "DB_USER": "your_username",
        "DB_PASSWORD": "your_password",
        "DB_NAME": "doctors_db"
      }
    }
  }
}
```

### Cursor

Add to your Cursor MCP settings:

```json
{
  "mcpServers": {
    "doctor-mcp": {
      "command": "node",
      "args": ["/path/to/doctor-mcp/dist/index.js"]
    }
  }
}
```

## 🛠️ Available Tools

### Core Tools
| Tool                           | Description                                               |
| ------------------------------ | --------------------------------------------------------- |
| `search_doctors`               | Search doctors by name                                    |
| `get_doctor_details`           | Get complete doctor profile with schedules                |
| `find_doctors_by_specialty`    | Find doctors by specialty (optionally filter by division) |
| `find_doctors_by_location`     | Find doctors in a specific division/district              |
| `find_doctors_by_hospital`     | Find all doctors at a specific hospital                   |
| `find_doctors_available_today` | Find doctors available today                              |
| `get_chamber_schedule`         | Get weekly schedule for a doctor                          |
| `list_specialties`             | List all medical specialties                              |
| `list_divisions`               | List Bangladesh divisions & districts                     |
| `list_hospitals`               | List hospitals (filter by division/type)                  |

### 🆕 New Features
| Tool                        | Description                                        |
| --------------------------- | -------------------------------------------------- |
| `find_doctors_by_symptoms`  | Find doctors based on symptoms (English & Bengali) |
| `find_doctors_by_fee`       | Find doctors within a fee range                    |
| `find_emergency_hospitals`  | Find 24/7 emergency hospitals                      |
| `list_insurance_providers`  | List supported health insurance providers          |
| `find_doctors_by_insurance` | Find doctors accepting specific insurance          |
| `get_top_rated_doctors`     | Get highly rated doctors (when ratings available)  |

## 📚 Resources

The server also exposes MCP resources:

- `doctors://specialties` - All medical specialties
- `doctors://divisions` - Bangladesh divisions and districts
- `doctors://hospitals` - All hospitals and clinics

## 💬 Example Queries

Once connected, you can ask the AI assistant:

### Basic Queries
- "Find cardiologists in Dhaka"
- "Show me the schedule for Prof. Dr. Afzalur Rahman"
- "Which doctors are available today at Square Hospital?"
- "Find female gynecologists with telemedicine"
- "List all government hospitals in Chittagong"

### 🆕 Symptom-Based Search
- "I have chest pain and difficulty breathing"
- "My child has fever and cough"
- "বুকে ব্যথা হচ্ছে" (Bengali symptoms work too!)
- "I'm feeling depressed and can't sleep"

### 🆕 Fee & Insurance
- "Find doctors with consultation fee under 1000 taka"
- "Which doctors accept Green Delta insurance?"
- "Find cardiologists accepting MetLife insurance"

### 🆕 Emergency Services
- "Find 24/7 emergency hospitals in Dhaka"
- "Which hospitals have ambulance service in Chittagong?"

## 📊 Current Data Coverage

### Statistics
- **8 Divisions** - All divisions of Bangladesh
- **65 Districts** - Complete district coverage
- **24 Specialties** - All specialties have doctors
- **57 Hospitals** - Government & private across all divisions (with emergency info)
- **55 Doctors** - Realistic profiles covering all specialties
- **122 Schedules** - Chamber/visiting schedules
- **10 Insurance Providers** - Health & corporate insurance

### Hospitals Included
- **Dhaka**: DMCH, BSMMU, NICVD, NINS, Square, United, Evercare, Apollo, Labaid, Ibn Sina, etc.
- **Chittagong**: CMCH, Max Hospital, Imperial, Parkview
- **Rajshahi**: RMCH, Islami Bank Hospital
- **Sylhet**: MAG Osmani, Mount Adora
- **Khulna**: KMCH, Gazi Medical
- **Other Divisions**: Medical college hospitals in each division

## 🗺️ Specialties (24+)

- **Medicine**: Cardiology, Neurology, Gastroenterology, Pulmonology, Nephrology, Endocrinology, Rheumatology, Dermatology, Psychiatry, Pediatrics, Oncology, Hematology
- **Surgery**: General Surgery, Orthopedics, Cardiac Surgery, Neurosurgery, Urology, ENT, Ophthalmology, Gynecology, Plastic Surgery
- **Others**: Physical Medicine, Dentistry

---

## 📈 How to Add More Data

### Adding Hospitals

Edit `src/db/data/hospitals.ts`:

```typescript
export const hospitalsData = [
  // Add new hospital
  {
    id: 'unique-id',
    nameEn: 'Hospital Name',
    nameBn: 'হাসপাতালের নাম',
    type: 'private' as const, // 'government' | 'private' | 'clinic' | 'diagnostic'
    divisionId: 'dhaka',
    districtId: 'dhaka-city',
    area: 'Gulshan',
    address: 'Full address',
    phone: '02-1234567',
    website: 'https://hospital.com', // optional
  },
  // ... existing hospitals
];
```

### Adding Doctors

Edit `src/db/data/doctors.ts`:

```typescript
export const doctorsData = [
  {
    id: 'dr-unique-id',
    nameEn: 'Prof. Dr. Full Name',
    nameBn: 'প্রফেসর ডা. পুরো নাম',
    bmdcRegNo: 'A-12345', // BMDC registration
    qualifications: ['MBBS', 'FCPS', 'MD'],
    primarySpecialtyId: 'cardiology', // Must match specialty ID
    subSpecialties: ['Interventional Cardiology'],
    designation: 'Professor & Head',
    experienceYears: 25,
    gender: 'male' as const, // 'male' | 'female'
    languages: ['Bengali', 'English'],
    consultationFeeMin: 1000,
    consultationFeeMax: 1500,
    telemedicineAvailable: true,
    bio: 'Brief biography',
    phone: '01711-123456', // optional
    email: 'doctor@email.com', // optional
  },
  // ... existing doctors
];
```

### Adding Chamber Schedules

Edit `src/db/data/schedules.ts`:

```typescript
export const chamberSchedulesData = [
  {
    id: 'cs-unique-id',
    doctorId: 'dr-unique-id', // Must match doctor ID
    hospitalId: 'hospital-id', // Must match hospital ID
    dayOfWeek: 0, // 0=Sunday, 1=Monday, ... 6=Saturday
    startTime: '09:00',
    endTime: '13:00',
    consultationFee: 1500,
    appointmentRequired: true,
    serialSystem: 'both' as const, // 'online' | 'spot' | 'both'
    maxPatients: 30,
  },
  // ... existing schedules
];
```

### After Adding Data

```bash
# Re-seed the database
npm run db:seed

# Rebuild (if needed)
npm run build
```

---

## 🔧 Improvement Ideas

### 1. Real Data Sources

Consider sourcing data from:

- **BMDC Website**: [bmdc.org.bd](https://bmdc.org.bd) - Official doctor registry
- **Hospital Websites**: Many hospitals list their doctors
- **Doctime**: [doctime.com.bd](https://doctime.com.bd) - Popular appointment platform
- **Praava Health**: [praavahealth.com](https://praavahealth.com)
- **Shasthyo Seba**: Government health portal

### 2. Additional Features to Implement

```typescript
// Feature ideas for future development:

// 1. Search by symptoms/conditions
// "I have chest pain" → suggest cardiologists

// 2. Fee range filter
// "Find doctors with fee under 1000 taka"

// 3. Rating/review system
// "Show top-rated cardiologists"

// 4. Appointment booking integration
// "Book appointment with Dr. X on Sunday"

// 5. Emergency contacts
// "Find nearest emergency hospital"

// 6. Health packages
// "Show health checkup packages at Square Hospital"

// 7. Insurance network
// "Doctors accepting XYZ insurance"
```

### 3. Data Enhancement Script

Create a script to fetch data from public sources:

```typescript
// src/scripts/fetch-doctors.ts
// Example: Fetch from hospital websites, aggregate data
```

### 4. API Improvements

- Add pagination for large result sets
- Add caching layer for frequently accessed data
- Add full-text search with PostgreSQL tsvector
- Add Bengali language search optimization

---

## 🏗️ Project Structure

```
doctor-mcp/
├── src/
│   ├── index.ts           # MCP server entry point
│   └── db/
│       ├── schema.ts      # Drizzle ORM schema (PostgreSQL)
│       ├── connection.ts  # Database connection
│       ├── queries.ts     # Database queries
│       ├── migrate.ts     # Migration script
│       ├── seed.ts        # Main seed script
│       ├── validate-data.ts # Data validation script
│       └── data/          # 📁 Data files (edit these!)
│           ├── districts.ts   # Divisions & districts
│           ├── specialties.ts # Medical specialties
│           ├── hospitals.ts   # Hospital data
│           ├── doctors.ts     # Doctor profiles
│           ├── schedules.ts   # Chamber schedules
│           ├── insurance.ts   # Insurance providers
│           └── symptoms.ts    # Symptom-to-specialty mapping
├── tests/                 # 🧪 Test files
│   ├── symptoms.test.ts   # Symptom mapping tests
│   ├── data.test.ts       # Data integrity tests
│   ├── schema.test.ts     # MCP tool schema tests
│   └── utils.test.ts      # Utility function tests
├── drizzle/               # Migration files
├── vitest.config.ts       # Vitest configuration
├── package.json
├── tsconfig.json
└── drizzle.config.ts
```

## 📝 Development

### Database Commands

```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Full setup (migrate + seed)
npm run db:setup

# Generate Drizzle migrations
npm run db:generate

# Validate data integrity
npm run db:validate
```

### Build

```bash
# Build TypeScript
npm run build

# Development with hot reload
npm run dev
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### Test Coverage

The test suite includes **156 tests** across 4 test files:

| Test File          | Tests | Description                             |
| ------------------ | ----- | --------------------------------------- |
| `symptoms.test.ts` | 46    | Symptom-to-specialty mapping tests      |
| `data.test.ts`     | 51    | Data integrity and validation tests     |
| `schema.test.ts`   | 37    | MCP tool input schema validation        |
| `utils.test.ts`    | 22    | Utility functions and format validation |

#### Test Categories

- **Symptom Mapping Tests**: Validates symptom keyword matching for 15+ medical specialties in English and Bengali
- **Data Integrity Tests**: Validates referential integrity between doctors, hospitals, schedules, and locations
- **Schema Tests**: Validates Zod schemas for all MCP tool inputs
- **Utility Tests**: Tests for data formatting, validation patterns, and helper functions

## 🤝 Contributing

Contributions are welcome! Priority areas:

1. **Add More Doctors** - Especially from outside Dhaka
2. **Verify Data** - Ensure accuracy of existing entries
3. **Add Hospitals** - District-level hospitals
4. **Improve Search** - Bengali text search optimization
5. **New Tools** - Symptom-based suggestions, emergency finder

### Contribution Guidelines

1. Fork the repository
2. Add data to the appropriate file in `src/db/data/`
3. Run `npm run db:seed` to test
4. Submit a pull request

## 📄 License

MIT License - feel free to use and modify for your needs.

## 🙏 Acknowledgments

- Bangladesh Medical and Dental Council (BMDC)
- All the dedicated doctors serving Bangladesh
- The MCP community

---

Made with ❤️ for Bangladesh's healthcare community
