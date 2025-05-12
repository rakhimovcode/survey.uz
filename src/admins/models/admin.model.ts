import { AllowNull, Column, DataType, Model, Table } from "sequelize-typescript"

interface IAdminCreationAttr{
    full_name:string
    email:string
    phone_number:string
    password:string
};
@Table({tableName:"admins"})
export class Admin extends Model<Admin,IAdminCreationAttr> {
    @Column({
        type:DataType.INTEGER,
        primaryKey:true,
        autoIncrement:true
    })
    declare id:number

    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare full_name:string

    @Column({
        type:DataType.STRING,
        allowNull:false,
        unique:true
    })
    declare email:string

    @Column({
        type:DataType.STRING,
        allowNull:false,
        unique:true
    })
    declare phone_number:string


    
    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    declare password:string


     @Column({
        type:DataType.STRING,
        defaultValue:""
    })
    declare refresh_token:string


     @Column({
        type:DataType.BOOLEAN,
        defaultValue:false
    })
    declare is_active:boolean


     @Column({
        type:DataType.BOOLEAN,
        defaultValue:false
    })
    declare is_creator:boolean
}
