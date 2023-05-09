import { UserList } from '@/lib/app-interface';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import userApi from '../../services/user';
import utils from '../../utils/index';

const TableList: React.FC = () => {
  // 新建窗口的弹窗
  const [createModal, setCreateModal] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);

  const pageSize: number = 10;
  const page: number = 1;
  // 设置列表字段
  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '用户Id',
      dataIndex: '_id',
      hideInTable: true,
      search: false,
    },
    {
      title: '昵称',
      dataIndex: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '个人签名',
      dataIndex: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        '-1': { text: '注销' },
        '1': { text: '正常' },
      },
      render: (dom, entity) => {
        return <Tag color={entity.status === 1 ? 'green' : 'volcano'}>{dom}</Tag>;
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          title={`您确定要删除该用户吗？`}
          onConfirm={async () => {
            const deletedCount = await userApi.delUsers(record._id as any);
            if (deletedCount > 0) {
              message.success('删除成功');
              await getUserList(page, pageSize);
            } else {
              message.warning('删除失败');
            }
          }}
          okText="确定"
          cancelText="取消"
        >
          <a key="delete">删除</a>
        </Popconfirm>,
      ],
    },
  ];

  const [userList, setUserList] = useState<UserList>();
  const getUserList = async (
    page: number,
    pageSize: number,
    username?: string,
    email?: string,
    status?: number,
  ) => {
    const userList = await userApi.getUserList({ page, pageSize, username, email, status });
    setUserList(userList);
  };

  useEffect(() => {
    getUserList(page, pageSize);
  }, []);

  const formRules = {
    user: [
      { required: true, message: '请输入由5-15数字,字母的用户名', trigger: 'blur' },
      () => ({
        validator(_: any, value: any) {
          if (utils.validUsername(value)) {
            return Promise.resolve();
          }
          return Promise.reject();
        },
      }),
    ],
    email: [
      { required: true, message: '请输入合法的邮箱', trigger: 'blur' },
      () => ({
        validator(_: any, value: any) {
          if (utils.validateEmail(value)) {
            return Promise.resolve();
          }
          return Promise.reject();
        },
      }),
    ],
    password: [
      { required: true, message: '请输入由5-15数字,字母组成的密码', trigger: 'blur' },
      () => ({
        validator(_: any, value: any) {
          if (utils.validPassword(value)) {
            return Promise.resolve();
          }
          return Promise.reject();
        },
      }),
    ],
  };

  const restFormRef = useRef<ProFormInstance>();

  return (
    <PageContainer>
      <ProTable<API.RuleListItem, API.PageParams>
        options={false}
        actionRef={actionRef}
        rowKey="_id"
        search={{
          labelWidth: 100,
          defaultCollapsed: false,
          optionRender: ({ searchText, resetText }, { form }) => [
            <Button
              key="search"
              type="primary"
              onClick={async () => {
                const values = form?.getFieldsValue();
                console.log(utils.validateEmail(values.email));
                if (!!values.username && !utils.validUsername(values.username)) {
                  message.error('请输入5-15位由数字、字母组成的用户名');
                } else if (!!values.email && !utils.validateEmail(values.email)) {
                  message.error('邮箱不正确');
                } else {
                  getUserList(page, pageSize, values.username, values.email, Number(values.status));
                }
              }}
            >
              {searchText}
            </Button>,
            <Button
              key="reset"
              onClick={() => {
                form?.resetFields();
              }}
            >
              {resetText}
            </Button>,
          ],
        }}
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => setCreateModal(true)}>
            <PlusOutlined /> New
          </Button>,
        ]}
        dataSource={userList?.users as any}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
          return (
            <Space size={16}>
              <a onClick={onCleanSelected}>取消选择</a>
              <Popconfirm
                title={`您确定要删除这些用户吗？`}
                onConfirm={async () => {
                  const _ids = selectedRowKeys;
                  const deletedCount = await userApi.delUsers(_ids as any);
                  if (deletedCount > 0) {
                    message.success('批量删除成功');
                    await getUserList(page, pageSize);
                  } else {
                    message.warning('批量删除失败');
                  }
                }}
                okText="确定"
                cancelText="取消"
              >
                <a>批量删除</a>
              </Popconfirm>
            </Space>
          );
        }}
        pagination={{
          showSizeChanger: false,
          showQuickJumper: false,
          pageSize: pageSize,
          total: userList?.totalUsers,
          showTotal: (total, range) => `共 ${total} 条，${range[0]}-${range[1]} 条`,
          onChange: (page, pageSize) => getUserList(page, pageSize),
        }}
      />
      {/* 新建弹窗 */}
      <ModalForm
        title="新建用户"
        width="400px"
        formRef={restFormRef}
        open={createModal}
        onOpenChange={setCreateModal}
        submitter={{
          searchConfig: {
            resetText: '取消',
          },
          resetButtonProps: {
            onClick: () => {
              restFormRef.current?.resetFields();
              setCreateModal(false);
            },
          },
        }}
        onFinish={async (value) => {
          const { success, msg } = await userApi.addUser(
            value.username,
            value.email,
            value.password,
          );
          restFormRef.current?.resetFields();
          if (success) {
            message.success(msg);
            getUserList(page, pageSize);
          } else {
            message.warning(msg);
          }
          return true;
        }}
      >
        <ProFormText rules={formRules.user as any} label="昵称" width="md" name="username" />
        <ProFormText rules={formRules.email as any} label="邮箱" width="md" name="email" />
        <ProFormText.Password
          rules={formRules.password as any}
          label="密码"
          width="md"
          name="password"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
