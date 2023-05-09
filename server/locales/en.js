// @ts-check

export default {
  translation: {
    appName: 'Fastify Boilerplate',
    flash: {
      session: {
        create: {
          success: 'You are logged in',
          error: 'Wrong email or password',
        },
        delete: {
          success: 'You are logged out',
        },
      },
      users: {
        create: {
          error: 'Failed to register',
          success: 'User registered successfully',
        },
        update: {
          success: 'User updated successfully',
          error: 'User updated failed',
          notFound: 'User not found',
          notAvalible: 'You can\'t  update other user',
        },
        delete: {
          success: 'User successfully deleted',
          error: 'User deleted failed',
          notAvalible: 'You can\'t  delete other user',
        },
      },
      statuses: {
        create: {
          error: 'Failed to create new status',
          success: 'Status created',
        },
        edit: {
          error: 'Failed to edit status',
          success: 'Status edited',
        },
        delete: {
          error: 'Failed to delete status',
          success: 'Status was deleted',
        },
      },
      authError: 'Access denied! Please login',
    },
    layouts: {
      application: {
        users: 'Users',
        signIn: 'Login',
        signUp: 'Register',
        signOut: 'Logout',
        tasks: 'Tasks',
        statuses: 'Statuses',
      },
    },
    views: {
      session: {
        new: {
          signIn: 'Login',
          submit: 'Login',
        },
      },
      users: {
        id: 'ID',
        fullName: 'Full Name',
        email: 'Email',
        createdAt: 'Created at',
        actions: 'Actions',
        new: {
          submit: 'Register',
          signUp: 'Register',
        },
      },
      welcome: {
        index: {
          hello: 'Hello from Hexlet!',
          description: 'Online programming school',
          more: 'Learn more',
        },
      },
      statuses: {
        title: 'Statuses',
        new: 'Creating a status',
        edit: {
          title: 'Editing a status',
          btn: 'Edit',
        },
        table: {
          id: 'Id',
          name: 'Name',
          date: 'Create date',
        },
        create: {
          title: 'Create status',
        },
      },
      tasks: {
        create: 'Create task',
        table: {
          id: 'Id',
          name: 'Name',
          status: 'Status',
          author: 'Author',
          executer: 'Exucuter',
          date: 'Create date',
        },
      },
    },
  },
};
