import { categoryList, UserList } from '@/lib/app-interface';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns, ProFormInstance } from '@ant-design/pro-components';
import { ModalForm, PageContainer, ProFormText, ProTable } from '@ant-design/pro-components';
import { Button, message, Popconfirm } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import categoryApi from '../../services/category';

const TableList: React.FC = () => {
  // 新建窗口的弹窗
  const [createModal, setCreateModal] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();

  const pageSize: number = 10;
  const page: number = 1;
  // 设置列表字段
  const columns: ProColumns<API.RuleListItem>[] = [
    {
      title: '类型Id',
      dataIndex: '_id',
      hideInTable: true,
      search: false,
    },
    {
      title: '电影类型',
      dataIndex: 'name',
    },
    {
      title: '关联电影数量',
      dataIndex: 'moviesLen',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <Popconfirm
          title={`您确定要删除该类型吗？`}
          onConfirm={async () => {
            const { _id, moviesLen } = record as any;
            if (moviesLen > 0) {
              message.warning('不能删除有关联电影的类型');
            } else {
              await categoryApi.deleteCategory(_id);
              message.success('删除成功');
              getCategoryList(page, pageSize);
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

  const [categoryList, setCategoryList] = useState<categoryList>();
  const getCategoryList = async (page: number, pageSize: number, name?: string) => {
    const categoryList = await categoryApi.getCategoryList(page, pageSize, name);
    setCategoryList(categoryList);
  };

  useEffect(() => {
    getCategoryList(page, pageSize);
  }, []);

  const formRules = [
    { required: true, message: '请输入由5-15数字,字母,_-组成的用户名', trigger: 'blur' },
  ];

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
                getCategoryList(page, pageSize, values.name);
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
        dataSource={categoryList?.categories as any}
        columns={columns}
        tableAlertRender={false}
        pagination={{
          showSizeChanger: false,
          showQuickJumper: false,
          pageSize: pageSize,
          total: categoryList?.totalCategories,
          showTotal: (total, range) => `共 ${total} 条，${range[0]}-${range[1]} 条`,
          onChange: (page, pageSize) => getCategoryList(page, pageSize),
        }}
      />
      {/* 新建弹窗 */}
      <ModalForm
        title="新建电影类型"
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
          const { success, msg } = await categoryApi.addCategory(value.name);
          if (!success) {
            message.warning(msg);
          } else {
            await getCategoryList(page, pageSize);
            message.success(msg);
          }
          restFormRef.current?.resetFields();
          return true;
        }}
      >
        <ProFormText rules={formRules as any} label="新类型" width="md" name="name" />
      </ModalForm>
    </PageContainer>
  );
};

export default TableList;
