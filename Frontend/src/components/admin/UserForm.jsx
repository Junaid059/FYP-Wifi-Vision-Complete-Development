import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Switch } from '../ui/switch';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Check,
  X,
  User,
  Mail,
  Key,
  Shield,
  UserCheck,
  Home,
  MapPin,
  Building,
} from 'lucide-react';

function UserForm({ existingUser, onSuccess }) {
  const { addUser, updateUser, currentUser } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: existingUser?.username || '',
    email: existingUser?.email || '',
    password: '',
    confirmPassword: '',
    role: existingUser?.role || 'user',
    isActive: existingUser?.isActive ?? true,
    adminPassword: '',
    // Add connection fields with existing data if available
    street: existingUser?.connection?.street || '',
    city: existingUser?.connection?.city || '',
    apartment: existingUser?.connection?.apartment || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!existingUser;

  const handleChange = (e) => {
    const { name, value } = e.target ? e.target : e;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!isEditMode) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        // For existing users, update Firestore with connection data
        const success = await updateUser(existingUser.id, {
          username: formData.username,
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive ?? true,
          connection: {
            street: formData.street,
            city: formData.city,
            apartment: formData.apartment,
          },
        });

        if (success) {
          toast.success(`User ${formData.username} updated successfully.`);
          if (onSuccess) onSuccess();
        } else {
          toast.error('Failed to update user. Please try again.');
        }
      } else {
        // For new users, create in both Auth and Firestore without connection data
        const userId = await addUser({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          isActive: formData.isActive ?? true,
          // No connection data for new users
        });

        if (userId) {
          toast.success(`User ${formData.username} created successfully.`);
          if (onSuccess) onSuccess();
        } else {
          toast.error('Failed to create user. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving user:', error);

      let errorMessage = 'An error occurred while saving the user.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage =
          'This email is already in use. Please use a different email.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'The email address is not valid.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage =
          'The password is too weak. It must be at least 6 characters.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const canEditRoles = currentUser?.role === 'admin';

  const getAvatarColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-br from-red-500 to-pink-600 text-white';
      case 'user':
        return 'bg-gradient-to-br from-green-500 to-teal-600 text-white';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className={isEditMode ? 'border-0 shadow-none' : 'border-0 shadow-lg'}
      >
        {!isEditMode && (
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Create New User
            </CardTitle>
            <CardDescription>
              Add a new user to the system with specific role and permissions
            </CardDescription>
          </CardHeader>
        )}
        <CardContent className={isEditMode ? 'px-0' : ''}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isEditMode && (
              <div className="flex items-center justify-center mb-6">
                <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                  <AvatarFallback className={getAvatarColor(formData.role)}>
                    {formData.username
                      ? formData.username.substring(0, 2).toUpperCase()
                      : 'NU'}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Username
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className={
                      errors.username
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }
                  />
                  {errors.username && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-4 w-4" />
                      {errors.username}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className={
                      errors.email
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-4 w-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Key className="h-4 w-4 text-gray-500" />
                    {isEditMode
                      ? 'New Password (leave blank to keep current)'
                      : 'Password'}
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder={
                      isEditMode ? 'Enter new password' : 'Enter password'
                    }
                    className={
                      errors.password
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-4 w-4" />
                      {errors.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="flex items-center gap-2"
                  >
                    <Key className="h-4 w-4 text-gray-500" />
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className={
                      errors.confirmPassword
                        ? 'border-red-500 focus-visible:ring-red-500'
                        : ''
                    }
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <X className="h-4 w-4" />
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role" className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-gray-500" />
                    Role
                  </Label>
                  <Select
                    name="role"
                    value={formData.role}
                    onValueChange={(value) =>
                      handleChange({ name: 'role', value })
                    }
                    disabled={
                      !canEditRoles ||
                      (isEditMode && existingUser?.id === currentUser?.uid)
                    }
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="user">Regular User</SelectItem>
                    </SelectContent>
                  </Select>

                  {!canEditRoles && (
                    <p className="text-xs text-amber-500 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      Only administrators can change user roles
                    </p>
                  )}
                  {isEditMode && existingUser?.id === currentUser?.uid && (
                    <p className="text-xs text-amber-500 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      You cannot change your own role
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="isActive" className="flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-gray-500" />
                    Account Status
                  </Label>
                  <div className="flex items-center space-x-2 h-10 px-3 border rounded-md">
                    <Switch
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) =>
                        handleChange({ name: 'isActive', value: checked })
                      }
                      disabled={
                        isEditMode && existingUser?.id === currentUser?.uid
                      }
                    />
                    <Label htmlFor="isActive" className="cursor-pointer">
                      {formData.isActive ? 'Active' : 'Inactive'}
                    </Label>
                  </div>
                  {isEditMode && existingUser?.id === currentUser?.uid && (
                    <p className="text-xs text-amber-500 flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      You cannot deactivate your own account
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Show connection fields ONLY in edit mode */}
            {isEditMode && (
              <div className="space-y-4 mt-6 border-t pt-6">
                <h3 className="text-lg font-medium">User Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="street" className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-gray-500" />
                      Street Address
                    </Label>
                    <Input
                      id="street"
                      name="street"
                      value={formData.street}
                      onChange={handleChange}
                      placeholder="Enter street address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="city" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      City
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter city"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="apartment"
                    className="flex items-center gap-2"
                  >
                    <Building className="h-4 w-4 text-gray-500" />
                    Apartment/Suite
                  </Label>
                  <Input
                    id="apartment"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleChange}
                    placeholder="Enter apartment or suite number (optional)"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-4">
              {isEditMode ? (
                <Button type="button" variant="outline" onClick={onSuccess}>
                  Cancel
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/users')}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{isEditMode ? 'Updating...' : 'Creating...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>{isEditMode ? 'Update User' : 'Create User'}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default UserForm;
