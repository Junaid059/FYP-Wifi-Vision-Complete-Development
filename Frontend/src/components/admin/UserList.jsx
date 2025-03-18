import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Pencil,
  Trash2,
  Search,
  Eye,
  UserCheck,
  UserX,
  Filter,
  Download,
  MoreHorizontal,
  RefreshCw,
  UserPlus,
} from 'lucide-react';
import { motion } from 'framer-motion';
import UserForm from './UserForm';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { toast } from 'sonner';

function UserList() {
  const { users, deleteUser, updateUser, currentUser } = useUser();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === 'all' || user.role === filterRole;

    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async () => {
    if (selectedUser) {
      await deleteUser(selectedUser.id);
      toast.success(
        `User ${selectedUser.username} has been deleted successfully.`
      );
      setIsDeleteDialogOpen(false);
    }
  };

  const handleToggleUserStatus = (user) => {
    if (user.id === currentUser?.id && user.isActive) {
      toast('Cannot deactivate');
      return;
    }

    updateUser(user.id, { isActive: !user.isActive });

    toast({
      title: user.isActive ? 'User deactivated' : 'User activated',
      description: `User ${user.username} has been ${
        user.isActive ? 'deactivated' : 'activated'
      } successfully.`,
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'super':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'user':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name) => {
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-br from-red-500 to-pink-600 text-white';
      case 'super':
        return 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white';
      case 'user':
        return 'bg-gradient-to-br from-green-500 to-teal-600 text-white';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-500">
            Manage your system users and their permissions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setViewMode(viewMode === 'cards' ? 'table' : 'cards')
            }
          >
            {viewMode === 'cards' ? 'Table View' : 'Card View'}
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => navigate('/admin/users/new')}>
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold">Users</CardTitle>
              <CardDescription>
                {filteredUsers.length} user
                {filteredUsers.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>

            <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Select
                  value={filterRole}
                  onValueChange={(value) => setFilterRole(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super">Super User</SelectItem>
                    <SelectItem value="user">Regular User</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon" onClick={handleRefresh}>
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
                  />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'table' ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage
                                src={`/placeholder.svg?height=40&width=40`}
                                alt={user.username}
                              />
                              <AvatarFallback
                                className={getAvatarColor(user.role)}
                              >
                                {getInitials(user.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{user.username}</div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={user.isActive ? 'outline' : 'secondary'}
                            className={
                              user.isActive
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-100 text-gray-700'
                            }
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {user.lastLogin
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleUserStatus(user)}
                              >
                                {user.isActive ? (
                                  <>
                                    <UserX className="h-4 w-4 mr-2 text-amber-500" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              {currentUser?.id !== user.id && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-10 text-gray-500"
                      >
                        No users found matching your search criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="group"
                  >
                    <Card className="border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                              <AvatarImage
                                src={`/placeholder.svg?height=48&width=48`}
                                alt={user.username}
                              />
                              <AvatarFallback
                                className={getAvatarColor(user.role)}
                              >
                                {getInitials(user.username)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.username}</div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsViewDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedUser(user);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleToggleUserStatus(user)}
                              >
                                {user.isActive ? (
                                  <>
                                    <UserX className="h-4 w-4 mr-2 text-amber-500" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              {currentUser?.id !== user.id && (
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <Badge className={getRoleBadgeColor(user.role)}>
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </Badge>

                          <Badge
                            variant={user.isActive ? 'outline' : 'secondary'}
                            className={
                              user.isActive
                                ? 'bg-green-50 text-green-700 border-green-200'
                                : 'bg-gray-100 text-gray-700'
                            }
                          >
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>

                        <div className="mt-4 text-xs text-gray-500 grid grid-cols-2 gap-2">
                          <div>
                            <div className="font-medium">Created</div>
                            <div>
                              {new Date(user.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                          <div>
                            <div className="font-medium">Last Login</div>
                            <div>
                              {user.lastLogin
                                ? new Date(user.lastLogin).toLocaleDateString()
                                : 'Never'}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-10 text-gray-500">
                  No users found matching your search criteria
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-white shadow-md">
                  <AvatarImage
                    src={`/placeholder.svg?height=64&width=64`}
                    alt={selectedUser.username}
                  />
                  <AvatarFallback className={getAvatarColor(selectedUser.role)}>
                    {getInitials(selectedUser.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{selectedUser.username}</h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500">Role</div>
                  <div className="font-medium">
                    <Badge className={getRoleBadgeColor(selectedUser.role)}>
                      {selectedUser.role.charAt(0).toUpperCase() +
                        selectedUser.role.slice(1)}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Status</div>
                  <div className="font-medium">
                    <Badge
                      variant={selectedUser.isActive ? 'outline' : 'secondary'}
                      className={
                        selectedUser.isActive
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-700'
                      }
                    >
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Created At</div>
                  <div className="font-medium">
                    {new Date(selectedUser.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Last Login</div>
                  <div className="font-medium">
                    {selectedUser.lastLogin
                      ? new Date(selectedUser.lastLogin).toLocaleDateString()
                      : 'Never'}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setIsEditDialogOpen(true);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit User
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              existingUser={selectedUser}
              onSuccess={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-100 text-red-800">
                <p>
                  Are you sure you want to delete this user? This action cannot
                  be undone.
                </p>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={`/placeholder.svg?height=48&width=48`}
                    alt={selectedUser.username}
                  />
                  <AvatarFallback className={getAvatarColor(selectedUser.role)}>
                    {getInitials(selectedUser.username)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.username}</div>
                  <div className="text-sm text-gray-500">
                    {selectedUser.email}
                  </div>
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteUser}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UserList;
