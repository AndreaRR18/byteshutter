# TypeScript Guidelines for Robust & Testable Code

## Type Safety

### Strict Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

### Explicit Types
```typescript
// Good
function calculateTotal(price: number, tax: number): number {
  return price + (price * tax);
}

// Avoid
function calculateTotal(price, tax) {
  return price + (price * tax);
}
```

### Use Union Types Instead of Any
```typescript
// Good
type Status = 'loading' | 'success' | 'error';

// Avoid
let status: any = 'loading';
```

## Interface Design

### Prefer Interfaces for Object Shapes
```typescript
interface User {
  readonly id: string;
  name: string;
  email: string;
  createdAt: Date;
}
```

### Use Optional Properties Wisely
```typescript
interface CreateUserRequest {
  name: string;
  email: string;
  avatar?: string; // Optional
}
```

### Extend Interfaces for Composition
```typescript
interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

interface User extends BaseEntity {
  name: string;
  email: string;
}
```

## Error Handling

### Use Result Pattern
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

async function fetchUser(id: string): Promise<Result<User>> {
  try {
    const user = await userService.getById(id);
    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

### Custom Error Classes
```typescript
class ValidationError extends Error {
  constructor(
    message: string,
    public field: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}
```

## Function Design

### Pure Functions
```typescript
// Good - Pure function
function calculateDiscount(price: number, percentage: number): number {
  return price * (percentage / 100);
}

// Avoid - Side effects
let globalDiscount = 0;
function calculateDiscount(price: number) {
  globalDiscount = price * 0.1; // Side effect
  return globalDiscount;
}
```

### Function Overloading
```typescript
function format(value: string): string;
function format(value: number, decimals: number): string;
function format(value: string | number, decimals?: number): string {
  if (typeof value === 'string') {
    return value.trim();
  }
  return value.toFixed(decimals || 2);
}
```

## Class Design

### Dependency Injection
```typescript
interface Logger {
  log(message: string): void;
}

class UserService {
  constructor(
    private logger: Logger,
    private repository: UserRepository
  ) {}

  async createUser(userData: CreateUserRequest): Promise<User> {
    this.logger.log(`Creating user: ${userData.email}`);
    return this.repository.save(userData);
  }
}
```

### Readonly Properties
```typescript
class User {
  readonly id: string;
  readonly createdAt: Date;
  
  constructor(id: string, public name: string) {
    this.id = id;
    this.createdAt = new Date();
  }
}
```

## Testing Guidelines

### Test-Friendly Interfaces
```typescript
interface UserRepository {
  findById(id: string): Promise<User | null>;
  save(user: User): Promise<User>;
  delete(id: string): Promise<void>;
}

// Easy to mock
class MockUserRepository implements UserRepository {
  private users = new Map<string, User>();
  
  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }
  
  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }
  
  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }
}
```

### Type Guards for Runtime Validation
```typescript
function isUser(obj: unknown): obj is User {
  return typeof obj === 'object' && 
         obj !== null && 
         'id' in obj && 
         'name' in obj && 
         'email' in obj;
}

// Usage in tests
if (isUser(response.data)) {
  expect(response.data.name).toBe('John Doe');
}
```

### Factory Functions for Test Data
```typescript
function createUser(overrides: Partial<User> = {}): User {
  return {
    id: 'test-id',
    name: 'Test User',
    email: 'test@example.com',
    createdAt: new Date(),
    ...overrides
  };
}

// Usage
const user = createUser({ name: 'Custom Name' });
```

## Utility Types

### Leverage Built-in Utility Types
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

// Pick specific fields
type PublicUser = Pick<User, 'id' | 'name' | 'email'>;

// Omit sensitive fields
type CreateUserRequest = Omit<User, 'id'>;

// Make all fields optional
type UpdateUserRequest = Partial<User>;

// Make specific fields required
type UserWithRequiredEmail = Required<Pick<User, 'email'>> & Partial<User>;
```

### Custom Utility Types
```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};
```

## Async Patterns

### Proper Promise Typing
```typescript
async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
```

### Async Iterators
```typescript
async function* processUsers(users: User[]): AsyncGenerator<ProcessedUser> {
  for (const user of users) {
    const processed = await processUser(user);
    yield processed;
  }
}
```

## Configuration & Environment

### Environment Variables
```typescript
interface Config {
  port: number;
  dbUrl: string;
  jwtSecret: string;
}

function loadConfig(): Config {
  const port = Number(process.env.PORT);
  const dbUrl = process.env.DATABASE_URL;
  const jwtSecret = process.env.JWT_SECRET;
  
  if (!dbUrl || !jwtSecret || isNaN(port)) {
    throw new Error('Missing required environment variables');
  }
  
  return { port, dbUrl, jwtSecret };
}
```

### Constants and Enums
```typescript
// Use const assertions for immutable data
const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
} as const;

// Use string enums for better debugging
enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator'
}
```

## Best Practices Summary

1. **Enable strict mode** - Catch errors at compile time
2. **Use explicit types** - Avoid `any`, prefer unions and interfaces
3. **Design for testability** - Use dependency injection and pure functions
4. **Handle errors explicitly** - Use Result types or proper error classes
5. **Leverage utility types** - Reduce code duplication with Pick, Omit, Partial
6. **Write type guards** - Validate runtime data with compile-time safety
7. **Use readonly when appropriate** - Prevent accidental mutations
8. **Create factory functions** - Generate consistent test data
9. **Type your promises** - Always specify return types for async functions
10. **Validate configuration** - Check environment variables at startup