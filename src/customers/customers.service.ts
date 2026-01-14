import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
// import { v4 as uuid } from 'uuid';
import { dynamodb } from 'src/config/dynamodb.config';
// import { PutItemCommand } from '@aws-sdk/client-dynamodb/dist-types/commands/PutItemCommand';
import { marshall } from '@aws-sdk/util-dynamodb';
import {
  DeleteItemCommand,
  GetItem$,
  GetItemCommand,
  PutItem$,
  PutItemCommand,
  QueryCommand,
  ReturnValue,
  ScanCommand,
  UpdateItemCommand,
  UpdateItemInput$,
} from '@aws-sdk/client-dynamodb';
import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { stringToBytes } from 'node_modules/uuid/dist/v35';
import { table } from 'console';

@Injectable()
export class CustomersService {
  private tableName = process.env.DYNAMODB_TABLE_NAME || 'customer_mgt';

  async create(createCustomerDto: CreateCustomerDto) {
    const customer = {
      // id: uuid(),
      id: '12ndei',
      ...createCustomerDto,
      createdAt: new Date().toISOString(),
    };
    await dynamodb.send(
      new PutItemCommand({
        TableName: this.tableName,
        Item: marshall(customer),
      }),
    );
    return 'New customer created: ' + JSON.stringify(customer);
  }

  async findAll() {
    const data = await dynamodb.send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );
    return data;
    // return JSON.stringify(data);
  }

  async findOne(id: number) {
    const data = await dynamodb.send(
      new QueryCommand({
        TableName: this.tableName,
        // FilterExpression: `id=:id`,
        ExpressionAttributeValues: {
          ':id': { N: id.toString() },
        },
        KeyConditionExpression: `id=:id`,
      }),
    );
    return data;
    return `This action returns a #${id} customer ${JSON.stringify(data)}`;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    const data = await dynamodb.send(
      new UpdateItemCommand({
        TableName: this.tableName,
        Key: marshall({ id: Number(id), name: String(updateCustomerDto.name) }),
        ReturnValues: 'UPDATED_NEW',
        UpdateExpression: 'SET #email = :email',
        ExpressionAttributeNames: {
          '#email': 'email',
        },
        ExpressionAttributeValues: marshall({
          ':email': updateCustomerDto.email,
        }),
      }),
    );

    return data;
  }

  async remove(id: number, name: string) {
    await dynamodb.send(
      new DeleteItemCommand({
        TableName: this.tableName,
        Key: marshall({ id: Number(id), name: name }),
        // ConditionExpression: `attribute_exists(id)`,
      }),
    );

    return `This action removes a ${id} customer`;
  }
}
