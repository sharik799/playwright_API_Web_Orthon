import sql, { config as SQLConfig } from "mssql";
import CustomReporterConfig from "../CustomReporterConfig";
const logger = CustomReporterConfig;


export class DBActions {
  private server: string;
  private user: string;
  private password: string;
  private database: string;
  private port: number;
  private pool: sql.ConnectionPool | null = null;

  constructor(server: string, user: string, password: string, database: string, port: number) {
    this.server = server;
    this.user = user;
    this.password = password;
    this.database = database;
    this.port = port;
  }

  private getConfig(): SQLConfig {
    return {
      user: this.user,
      password: this.password,
      server: this.server,
      database: this.database,
      port: this.port,
      options: {
        encrypt: true,                // required by Azure
        trustServerCertificate: true, // needed for dev/local SQL Server
      },
    };
  }

  public async connectToDB(): Promise<void> {
    logger.logInfo(`DB connection action started`);
    try {
      this.pool = await sql.connect(this.getConfig());
      logger.logInfo(`DB connected successfully`);
    } catch (err) {
      logger.logInfo(`DB connection failed: ${err}`);
      throw err;
    }
  }

  public async executeQuery(query: string, params: any[] = []): Promise<any[]> {
    if (!this.pool) {
        await this.connectToDB();
    }
    try {
        const request = this.pool!.request();
        params.forEach((param, index) => {
            request.input(`param${index}`, param);
        });

        const result = await request.query(query);
        
        logger.logInfo(`SQL Query Result:\n` + JSON.stringify(result.recordset, null, 2)); // 2 for pretty-printing
        
        return result.recordset;
    } catch (err) {
        logger.logInfo(`SQL query error: ${err}`);
        throw err;
    }
}

  /**
 * Get cell data from database response
 */
public async getCellDataFromDBResponse(
  dbResponse: any[],
  rowIndex: number,
  columnName: string
): 
Promise<any> {
  if (!Array.isArray(dbResponse)) {
    throw new Error(`Invalid dbResponse. Expected array but got: ${typeof dbResponse}`);
  }
  if (rowIndex < 1 || rowIndex > dbResponse.length) {
    throw new Error(`Row ${rowIndex} out of range. Total rows: ${dbResponse.length}`);
  }
  const row = dbResponse[rowIndex - 1];
  if (!(columnName in row)) {
    throw new Error(`Column "${columnName}" not found in database row`);
  }
  return row[columnName];
}

  public async closeDbConnection(): Promise<void> {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
      logger.logInfo(`DB connection closed`);
    }
  }

  
}
