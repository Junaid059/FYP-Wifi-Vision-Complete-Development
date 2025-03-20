'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  deleteDoc,
  setDoc,
} from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '../../firebaseConfig';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Trash2,
  Search,
  Download,
  RefreshCw,
  Mail,
  Phone,
  Building,
  User,
  UserPlus,
  CheckCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

function AdminDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    username: '',
    role: 'user',
  });
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const submissionsRef = collection(db, 'contactSubmissions');
      const q = query(submissionsRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      const submissionsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date(),
        converted: false, // Track if this submission has been converted to a user
      }));

      setSubmissions(submissionsList);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to load user data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSubmissions().finally(() => {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteDoc(doc(db, 'contactSubmissions', id));
        setSubmissions(
          submissions.filter((submission) => submission.id !== id)
        );
        toast.success('Submission deleted successfully');
      } catch (error) {
        console.error('Error deleting submission:', error);
        toast.error('Failed to delete submission');
      }
    }
  };

  const handleExport = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Company', 'Message', 'Date'],
      ...submissions.map((submission) => [
        submission.name,
        submission.email,
        submission.phone || 'N/A',
        submission.company || 'N/A',
        submission.message,
        new Date(submission.timestamp).toLocaleString(),
      ]),
    ]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `user_submissions_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openCreateUserDialog = (submission) => {
    setSelectedSubmission(submission);
    setNewUser({
      email: submission.email || '',
      password: '', // Generate a random password or require admin to set one
      username: submission.name || '',
      role: 'user',
    });
    setIsCreateUserDialogOpen(true);
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.password || !newUser.username) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsCreatingUser(true);
    try {
      // 1. Create the user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );

      // 2. Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        createdAt: new Date(),
        createdFrom: selectedSubmission.id, // Reference to the original submission
        phone: selectedSubmission.phone || null,
        company: selectedSubmission.company || null,
      });

      // 3. Update the submission to mark it as converted
      const updatedSubmissions = submissions.map((sub) =>
        sub.id === selectedSubmission.id ? { ...sub, converted: true } : sub
      );
      setSubmissions(updatedSubmissions);

      toast.success(`User ${newUser.username} created successfully`);
      setIsCreateUserDialogOpen(false);
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(`Failed to create user: ${error.message}`);
    } finally {
      setIsCreatingUser(false);
    }
  };

  const filteredSubmissions = submissions.filter((submission) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      submission.name?.toLowerCase().includes(searchLower) ||
      submission.email?.toLowerCase().includes(searchLower) ||
      submission.company?.toLowerCase().includes(searchLower) ||
      submission.message?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            User Submissions
          </h1>
          <p className="text-gray-500">
            Manage contact form submissions and create user accounts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <CardTitle className="text-xl font-semibold">
                Contact Form Submissions
              </CardTitle>
              <CardDescription>
                {filteredSubmissions.length} submission
                {filteredSubmissions.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                placeholder="Search submissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-2 text-gray-600">Loading submissions...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubmissions.length > 0 ? (
                    filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <span className="font-medium">
                              {submission.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-500" />
                            <span>{submission.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {submission.phone ? (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span>{submission.phone}</span>
                            </div>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-600"
                            >
                              Not provided
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {submission.company ? (
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-gray-500" />
                              <span>{submission.company}</span>
                            </div>
                          ) : (
                            <Badge
                              variant="outline"
                              className="bg-gray-100 text-gray-600"
                            >
                              Not provided
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div
                            className="max-w-xs truncate"
                            title={submission.message}
                          >
                            {submission.message}
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(submission.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {submission.converted ? (
                              <Badge
                                variant="outline"
                                className="bg-green-100 text-green-700 border-green-200"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                User Created
                              </Badge>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                onClick={() => openCreateUserDialog(submission)}
                              >
                                <UserPlus className="h-4 w-4 mr-1" />
                                Create User
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleDelete(submission.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-10 text-gray-500"
                      >
                        No submissions found matching your search criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create User Dialog */}
      <Dialog
        open={isCreateUserDialogOpen}
        onOpenChange={setIsCreateUserDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a user account from this form submission.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={newUser.username}
                onChange={(e) =>
                  setNewUser({ ...newUser, username: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser({ ...newUser, password: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                value={newUser.role}
                onValueChange={(value) =>
                  setNewUser({ ...newUser, role: value })
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="super">Super</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              disabled={isCreatingUser}
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              {isCreatingUser ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;
