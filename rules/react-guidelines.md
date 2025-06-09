# React Guidelines for Robust & Testable Code

## Component Structure

### Keep Components Small and Focused
- Single responsibility principle: one component, one purpose
- Extract logic into custom hooks when components exceed 150 lines
- Prefer composition over inheritance

### Use Functional Components with Hooks
```jsx
// ✅ Good
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Component logic here
};

// ❌ Avoid class components for new code
class UserProfile extends React.Component { ... }
```

## State Management

### Use Local State When Possible
- Keep state as close to where it's used as possible
- Lift state up only when sharing between siblings
- Consider context for deeply nested prop drilling

### Immutable State Updates
```jsx
// ✅ Good
setUsers(prevUsers => [...prevUsers, newUser]);
setUser(prevUser => ({ ...prevUser, name: newName }));

// ❌ Bad
users.push(newUser);
setUsers(users);
```

### Use useReducer for Complex State Logic
```jsx
const [state, dispatch] = useReducer(reducer, initialState);
```

## Props and Data Flow

### Define PropTypes or Use TypeScript
```jsx
// PropTypes
UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func
};

// TypeScript
interface User {
  id: number;
  name: string;
}

interface UserCardProps {
  user: User;
  onEdit?: () => void;
}
```

### Destructure Props Early
```jsx
// ✅ Good
const UserCard = ({ user, onEdit, isActive = false }) => {
  return <div className={isActive ? 'active' : ''}>{user.name}</div>;
};
```

## Event Handling

### Use Arrow Functions for Event Handlers
```jsx
// ✅ Good
const handleSubmit = (e) => {
  e.preventDefault();
  // Handle form submission
};

// ✅ Also good for inline handlers with parameters
<button onClick={() => handleEdit(user.id)}>Edit</button>
```

### Avoid Inline Object Creation in JSX
```jsx
// ❌ Bad - creates new object on every render
<UserCard style={{ margin: '10px' }} />

// ✅ Good
const cardStyle = { margin: '10px' };
<UserCard style={cardStyle} />
```

## Performance Optimization

### Use React.memo for Pure Components
```jsx
const UserCard = React.memo(({ user, onEdit }) => {
  return <div>{user.name}</div>;
});
```

### Optimize with useMemo and useCallback
```jsx
const ExpensiveComponent = ({ items, filter }) => {
  const filteredItems = useMemo(() => 
    items.filter(item => item.category === filter), 
    [items, filter]
  );
  
  const handleClick = useCallback((id) => {
    // Handle click
  }, []);
  
  return <ItemList items={filteredItems} onClick={handleClick} />;
};
```

### Use Keys Properly in Lists
```jsx
// ✅ Good - stable, unique keys
{users.map(user => (
  <UserCard key={user.id} user={user} />
))}

// ❌ Bad - index as key when list can change
{users.map((user, index) => (
  <UserCard key={index} user={user} />
))}
```

## Testing Guidelines

### Structure for Testability
```jsx
// ✅ Testable component
const UserList = ({ users, onUserSelect, filterText = '' }) => {
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(filterText.toLowerCase())
  );
  
  return (
    <div data-testid="user-list">
      {filteredUsers.map(user => (
        <UserCard 
          key={user.id} 
          user={user} 
          onClick={() => onUserSelect(user)}
          data-testid={`user-${user.id}`}
        />
      ))}
    </div>
  );
};
```

### Use data-testid for Test Selectors
```jsx
<button data-testid="submit-button" onClick={handleSubmit}>
  Submit
</button>
```

### Test Component Behavior, Not Implementation
```jsx
// ✅ Good test
test('displays filtered users based on search', () => {
  render(<UserList users={mockUsers} filterText="john" />);
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
});
```

### Mock External Dependencies
```jsx
// Mock API calls
jest.mock('../services/userService', () => ({
  fetchUsers: jest.fn(() => Promise.resolve(mockUsers))
}));
```

## Custom Hooks

### Extract Reusable Logic
```jsx
// ✅ Custom hook for API calls
const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  return { users, loading, error };
};
```

### Test Custom Hooks
```jsx
import { renderHook } from '@testing-library/react';

test('useUsers fetches and returns user data', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useUsers());
  
  expect(result.current.loading).toBe(true);
  await waitForNextUpdate();
  expect(result.current.users).toHaveLength(3);
});
```

## Error Handling

### Use Error Boundaries
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
  }
  
  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

### Handle Async Errors in useEffect
```jsx
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await apiCall();
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

## Code Organization

### File Structure
```
src/
  components/
    common/
    features/
      UserManagement/
        UserList.jsx
        UserCard.jsx
        __tests__/
          UserList.test.jsx
  hooks/
  services/
  utils/
  __tests__/
```

### Export Patterns
```jsx
// ✅ Named exports for better tree shaking
export const UserCard = ({ user }) => { ... };
export const UserList = ({ users }) => { ... };

// ✅ Default export for main component
const UserManagement = () => { ... };
export default UserManagement;
```

## Best Practices Summary

1. **Keep it simple**: Prefer simple solutions over complex abstractions
2. **Test early**: Write tests alongside component development  
3. **Be consistent**: Follow team conventions and style guides
4. **Performance matters**: Profile and optimize when necessary
5. **Type safety**: Use TypeScript or PropTypes for better development experience
6. **Accessibility**: Include ARIA attributes and semantic HTML
7. **Error handling**: Always handle loading, success, and error states
8. **Documentation**: Comment complex logic and provide usage examples